"""A quiet, paper-like opening and an idle reel made from Beibei's own work."""
from pathlib import Path
from PIL import Image,ImageFont,ImageDraw,ImageFilter
from functools import lru_cache
import subprocess,os,shutil,math,sys
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/assets/intro'
W,H,FPS=1920,934,30
FFMPEG=os.environ.get('OPENING_FFMPEG') or shutil.which('ffmpeg')
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
SOURCES=['pocklet-cover.png','roofbook-cover-two-spreads-v7.png','shuxia/postcards-water.webp','graft/hero.webp','shuxia/courtyard-poster.webp','icepact-poster.webp']
ART=[Image.open(ROOT/'public/assets'/s).convert('RGB') for s in SOURCES]
# Three pieces of work retain their own proportions, like prints on a desk.
LAYOUT=[(688,508,420,410,-5),(986,446,486,486,1),(1294,504,356,454,5)]

def clamp(v):return max(0.,min(1.,v))
def ease(v):v=clamp(v);return v*v*(3-2*v)

@lru_cache(maxsize=32)
def print_card(index,slot):
 _,_,bw,bh,angle=LAYOUT[slot]
 im=ART[index].copy();im.thumbnail((bw-16,bh-16),Image.Resampling.LANCZOS)
 paper=Image.new('RGBA',(im.width+16,im.height+16),'white');paper.paste(im,(8,8))
 # A barely visible paper edge, not a UI card or a new decorative identity.
 ImageDraw.Draw(paper).rectangle((0,0,paper.width-1,paper.height-1),outline=(224,224,216,170),width=1)
 paper=paper.rotate(angle,Image.Resampling.BICUBIC,expand=True)
 pad=28;shadow=Image.new('RGBA',(paper.width+pad*2,paper.height+pad*2))
 alpha=Image.new('L',shadow.size);alpha.paste(paper.getchannel('A'),(pad,pad+6));alpha=alpha.filter(ImageFilter.GaussianBlur(12)).point(lambda v:round(v*.11))
 shadow.putalpha(alpha);shadow.alpha_composite(paper,(pad,pad))
 return shadow

def paste(frame,card,cx,cy,alpha=1,scale=1):
 if scale!=1:card=card.resize((max(1,round(card.width*scale)),max(1,round(card.height*scale))),Image.Resampling.BICUBIC)
 if alpha<.999:
  card=card.copy();card.putalpha(card.getchannel('A').point(lambda a:round(a*alpha)))
 frame.alpha_composite(card,(round(cx-card.width/2),round(cy-card.height/2)))

font_size=20
while True:
 font=ImageFont.truetype(FONT,font_size)
 if font.getlength('Beibei Zhu')>=W*.63:break
 font_size+=1
box=font.getbbox('Beibei Zhu',anchor='ls')
name=Image.new('RGBA',(box[2]-box[0]+4,box[3]-box[1]+4))
ImageDraw.Draw(name).text((2-box[0],2-box[1]),'Beibei Zhu',font=font,fill=(36,38,34),anchor='ls')

def intro(t):
 frame=Image.new('RGBA',(W,H),'white')
 if t<3.35:
  arrive=ease((t-.15)/1.25);leave=ease((t-2.15)/1.20)
  paste(frame,name,W*.5,H*.81+20*(1-arrive)-9*leave,arrive*(1-leave))
 for slot in [0,2,1]:
  start=[1.85,2.15,2.50][slot]
  u=ease((t-start)/1.45)
  x,y,*_=LAYOUT[slot]
  paste(frame,print_card(slot,slot),x,y+18*(1-u),u,.975+.025*u)
 return frame.convert('RGB')

def idle(t):
 frame=Image.new('RGBA',(W,H),'white')
 # Advance one photograph at a time; all motion is a slow dissolve in place.
 events=[(1.2,1,3),(4.2,0,4),(7.2,2,5),(10.2,1,1),(13.2,0,0),(16.2,2,2)]
 for slot in [0,2,1]:
  current=slot;old=slot;blend=1
  for start,s,new in events:
   if s!=slot or t<start:continue
   old=current;current=new;blend=ease((t-start)/1.4)
  x,y,*_=LAYOUT[slot]
  if blend<1:paste(frame,print_card(old,slot),x,y)
  paste(frame,print_card(current,slot),x,y,blend)
 return frame.convert('RGB')

def encode(name,seconds,render):
 destination=OUT/name;temporary=OUT/(name+'.rendering.mp4')
 cmd=[FFMPEG,'-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',str(temporary)]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 for i in range(round(seconds*FPS)):
  proc.stdin.write(render(i/FPS).tobytes())
 proc.stdin.close()
 if proc.wait()!=0:raise RuntimeError('Encoding failed')
 temporary.replace(destination)
 print('Written',name,flush=True)

if '--storyboard' in sys.argv:
 times=[.3,1.4,2.6,3.4,4.4,6.]
 sheet=Image.new('RGB',(1440,2*270),'#eee');d=ImageDraw.Draw(sheet)
 for i,t in enumerate(times):
  im=intro(t);im.thumbnail((480,234));x=i%3*480;y=i//3*270;sheet.paste(im,(x,y));d.text((x+10,y+242),f'{t:.1f}s',fill='#242622')
 sheet.save('/tmp/beibei-personal-opening-storyboard.jpg')
else:
 encode('opening-personal.mp4',6.,intro)
 encode('opening-personal-idle.mp4',20.,idle)
 intro(0).save(OUT/'opening-personal-start.webp',quality=88)
 idle(0).save(OUT/'opening-personal-poster.webp',quality=88)
