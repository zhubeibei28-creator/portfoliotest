"""Render the portfolio's white opening using its own name, type and project art.

Motion is measured in a 960x540 storyboard space, then corrected to a 2.056:1
square-pixel canvas. Original project images stay untouched.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageChops
import numpy as np
import subprocess, math, json, sys, os, shutil
from functools import lru_cache

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/intro'
OUT.mkdir(parents=True,exist_ok=True)
W,H,FPS,DURATION=1920,934,48,11.7708333333
FFMPEG=os.environ.get('OPENING_FFMPEG') or shutil.which('ffmpeg')
if not FFMPEG:raise RuntimeError('Set OPENING_FFMPEG to an ffmpeg executable')
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
NAME='Beibei Zhu'
INK=(36,38,34)
# Back to front, using only Beibei's project artwork.
SOURCES=[
 'shuxia/postcards-water.webp','roofbook/unfolded.jpg',
 'graft/hero.webp','shuxia/courtyard-poster.webp',
 'shuxia/signage.webp','pocklet-cover.png',
 'shuxia/website-grass.webp','icepact-poster.webp',
 'graft/tile-logo-wall.webp','roofbook-cover-two-spreads-v7.png',
]
# x, y, width, height: measured small-assembly and expanded arrangements.
SMALL=[(349,201,87,101),(375,208,87,101),(396,231,87,101),
       (418,257,87,101),(440,231,87,101),(460,208,87,101),
       (478,184,87,101),(500,208,87,101),(515,218,87,101),(520,232,87,101)]
LARGE=[(492,167,227,262),(456,157,227,262),(426,123,227,262),
       (397,89,227,262),(367,123,227,262),(337,157,227,262),
       (308,191,227,262),(279,157,227,262),(258,123,227,262),(237,108,252,291)]
CAMERA=[(6.125,0),(6.25,.07),(6.375,.21),(6.5,.758),(6.625,.883),(6.75,.96),(7.,1)]


def clamp(x):return max(0.,min(1.,x))
def ease_out(x):return 1-(1-clamp(x))**3

def curve(points,t):
 if t<=points[0][0]:return points[0][1]
 for (a,x),(b,y) in zip(points,points[1:]):
  if t<=b:
   u=(t-a)/(b-a)
   return x+(y-x)*u
 return points[-1][1]

def mix(a,b,u):return tuple(x+(y-x)*u for x,y in zip(a,b))

def font_fit(text,width,spacing_ratio):
 size=32
 while True:
  f=ImageFont.truetype(FONT,size)
  length=sum(f.getlength(c) for c in text)+(len(text)-1)*size*spacing_ratio
  if length>=width:return f, size*spacing_ratio,length
  size+=1

big_font,big_spacing,big_width=font_fit(NAME,W*.965,-.063)
small_font,small_spacing,small_width=font_fit(NAME,W*(91/960),-.063)

def glyphs(font,spacing):
 result=[];x=0
 for c in NAME:
  box=font.getbbox(c,anchor='ls')
  im=Image.new('L',(max(1,box[2]-box[0]+8),max(1,box[3]-box[1]+8)))
  ImageDraw.Draw(im).text((4-box[0],4-box[1]),c,font=font,fill=255,anchor='ls')
  result.append((im,x+box[0]-4,box[1]-4))
  x+=font.getlength(c)+spacing
 return result
BIG=glyphs(big_font,big_spacing);SMALL_GLYPHS=glyphs(small_font,small_spacing)
ART=[]
for src in SOURCES:
 im=Image.open(ROOT/'public/assets'/src).convert('RGB')
 ART.append(ImageOps.fit(im,(700,700),Image.Resampling.LANCZOS))
@lru_cache(maxsize=64)
def resized_art(i,width,height):
 return ART[i].resize((width,height),Image.Resampling.BICUBIC)
def artwork(i,width,height):
 # Quantize two pixels and cap cached frames to keep memory bounded.
 return resized_art(i,max(2,round(width/2)*2),max(2,round(height/2)*2))

def add_card(frame,i,rect,opacity=1):
 x,y,w,h=rect
 x*=W/960;y*=H/540;w*=W/960;h*=H/540
 im=artwork(i,w,h)
 if opacity<.999:
  im=im.copy();im.putalpha(round(clamp(opacity)*255))
 frame.paste(im,(round(x),round(y)),im if im.mode=='RGBA' else None)

def folded_glyph(glyph,y,angle,font_size):
 # Project each letter about its baseline; inverse-map the four corners.
 angle=min(89.5,max(0.,angle))*math.pi/180
 if angle<.0001:return glyph,-glyph.width/2,y
 d=font_size*2.4;cs=math.cos(angle);sn=math.sin(angle)
 src=[(0,0),(glyph.width,0),(glyph.width,glyph.height),(0,glyph.height)]
 dst=[]
 for x0,y0 in src:
  xx=x0-glyph.width/2;yy=y+y0;k=d/(d-yy*sn)
  dst.append((xx*k,yy*cs*k))
 minx=min(x for x,y0 in dst);miny=min(y0 for x,y0 in dst)
 dw=max(1,math.ceil(max(x for x,y0 in dst)-minx));dh=max(1,math.ceil(max(y0 for x,y0 in dst)-miny))
 A=[];B=[]
 for (sx,sy),(dx,dy) in zip(src,dst):
  dx-=minx;dy-=miny
  A.extend([[dx,dy,1,0,0,0,-sx*dx,-sx*dy],[0,0,0,dx,dy,1,-sy*dx,-sy*dy]])
  B.extend([sx,sy])
 coeff=np.linalg.solve(np.asarray(A),np.asarray(B))
 return glyph.transform((dw,dh),Image.Transform.PERSPECTIVE,tuple(coeff),Image.Resampling.BICUBIC),minx,miny

def big_name_mask(t):
 mask=Image.new('L',(W,H))
 angle=curve([(0,89.5),(.06,58),(.125,50),(.25,48),(.375,41),(.5,29),(.625,14),(.75,7),(.875,0)],t)
 base=H*curve([(0,1.015),(.65,1.015),(1.,.995),(1.5,.981)],t)
 for i,(glyph,x,y) in enumerate(BIG):
  local=t-.02-i*.075
  if local<0:continue
  reveal=ease_out(local/.12)
  extra=big_font.size*.23*(1-reveal)
  leave=2.+(len(NAME)-1-i)*.045
  if t>leave:
   u=clamp((t-leave)/.28);extra+=H*.5*u*u
  warped,dx,dy=folded_glyph(glyph,y,angle,big_font.size)
  if reveal<.999:warped=warped.point(lambda v:round(v*reveal))
  mask.paste(warped,(round(W*.018+x+glyph.width/2+dx),round(base+dy+extra)),warped)
 return mask

def small_name_mask(t):
 mask=Image.new('L',(W,H));center_y=H*(282.5/540)
 ascent,descent=small_font.getmetrics()
 # Align the glyph's optical midpoint to the measured center baseline.
 base=center_y+(ascent-descent)*.34
 for i,(glyph,x,y) in enumerate(SMALL_GLYPHS):
  local=t-(2.37+i*.047)
  if local<0:continue
  u=ease_out(local/.42);offset=(1-u)*H*.06
  leave=10.36+(len(NAME)-1-i)*.065
  if t>leave:offset+=clamp((t-leave)/.35)**2*H*.08
  layer=Image.new('L',(W,H));layer.paste(glyph,(round((W-small_width)/2+x),round(base+y+offset)),glyph)
  # A fixed reveal line gives each letter a real below-baseline entrance/exit.
  clip=Image.new('L',(W,H));ImageDraw.Draw(clip).rectangle((0,center_y-H*.034,W,center_y+H*.024),fill=255)
  layer=ImageChops.multiply(layer,clip)
  mask=ImageChops.lighter(mask,layer)
 return mask

def render(t):
 frame=Image.new('RGB',(W,H),'white')
 for i in range(len(ART)):
  start=3.36+i*.16
  if t<start:continue
  if t<6.125:
   # Each photograph first arrives large at its expanded position, then joins
   # the small assembly. This is separate from the later camera move.
   arrival=clamp((t-start)/.11)
   if arrival<1:
    x,y,w,h=LARGE[i];rect=(x+w*(1-arrival)/2,y+h*(1-arrival)/2,w*arrival,h*arrival)
   else:rect=mix(LARGE[i],SMALL[i],ease_out((t-start-.11)/.70))
  else:rect=mix(SMALL[i],LARGE[i],curve(CAMERA,t))
  leave=7.12+(9-i)*.275
  opacity=1
  if t>leave:
   u=ease_out((t-leave)/.24)
   x,y,w,h=rect
   # Sequential retraction, rather than fading the whole pile together.
   rect=(x+w*.08*u,y+h*.04*u,w*(1-.16*u),h*(1-.16*u))
   opacity=1-u
  if opacity>.001:add_card(frame,i,rect,opacity)
 if t<2.85:
  mask=big_name_mask(t)
  frame.paste(INK,(0,0),mask)
 if 2.32<t<11.6:
  mask=small_name_mask(t)
  frame=Image.composite(ImageChops.invert(frame),frame,mask)
 return frame

if '--storyboard' in sys.argv:
 times=[.25,.75,1.5,2.4,3.5,4.5,5.75,6.4,6.75,7.25,8.5,9.5]
 sheet=Image.new('RGB',(1600,3*225+3*25),'#ddd');d=ImageDraw.Draw(sheet)
 for n,t in enumerate(times):
  im=render(t);im.thumbnail((400,200));x=n%4*400;y=n//4*225;sheet.paste(im,(x,y));d.text((x+8,y+202),f'{t:.2f}s',fill='black')
 sheet.save('/tmp/beibei-opening-measured-storyboard.jpg')
else:
 cmd=[FFMPEG,'-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
      '-an','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'opening-v2.mp4')]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 for i in range(round(DURATION*FPS)):
  proc.stdin.write(render(i/FPS).tobytes())
  if i%90==0:print(f'Rendered {i}/{round(DURATION*FPS)} frames',flush=True)
 proc.stdin.close()
 if proc.wait()!=0:raise RuntimeError('Video encoding failed')
 render(0.).save(OUT/'opening-v2-start.webp',quality=88)
 render(7.).save(OUT/'opening-v2-poster.webp',quality=88)
 (OUT/'opening-v2-timing.json').write_text(json.dumps({'duration':round(DURATION,4),'fps':FPS,'size':[W,H],'nameEnter':[0,1.9],'nameExit':[2.,2.8],'smallName':[2.37,3.2],'imageAssembly':[3.36,6.125],'camera':CAMERA,'imageExit':[7.12,9.84]},indent=2))
 print('Written',OUT/'opening-v2.mp4',flush=True)
