'use client';
import {useEffect,useRef,useState} from 'react';
import './trail-intro.css';

export default function TrailIntro({onOriginal}:{onOriginal:()=>void}){
 const film=useRef<HTMLVideoElement>(null);
 const root=useRef<HTMLElement>(null);
 const touch=useRef<number|null>(null);
 const [leaving,setLeaving]=useState(false);
 const [ready,setReady]=useState(false);
 const exited=useRef(false);
 const exit=useRef(onOriginal);exit.current=onOriginal;
 const finish=()=>{
  if(exited.current)return;exited.current=true;
  const node=root.current,video=film.current;
  video?.pause();
  if(node){
   const duration=1700,easing='cubic-bezier(.45,0,.2,1)';
   const name=node.querySelector<HTMLElement>('.bottom-opening-name');
   const mark=document.querySelector<HTMLElement>('.persistent-header .wordmark');
   if(name&&mark){
    const a=name.getBoundingClientRect(),b=mark.getBoundingClientRect();
    const clone=name.cloneNode(true) as HTMLElement;clone.className='morph-name-copy';
    Object.assign(clone.style,{left:`${a.left}px`,top:`${a.top}px`,width:`${a.width}px`,height:`${a.height}px`,fontSize:getComputedStyle(name).fontSize});
    clone.querySelectorAll<HTMLElement>('span').forEach(el=>el.style.animation='none');node.appendChild(clone);
    clone.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${b.left-a.left}px,${b.top-a.top}px) scale(${b.width/a.width},${b.height/a.height})`}],{duration,easing,fill:'both'});
    clone.animate([{opacity:1},{offset:.9,opacity:1},{opacity:0}],{duration,easing:'linear',fill:'both'});
    const final=mark.cloneNode(true) as HTMLElement;final.className='morph-final-name';Object.assign(final.style,{left:`${b.left}px`,top:`${b.top}px`,width:`${b.width}px`,height:`${b.height}px`,fontSize:getComputedStyle(mark).fontSize});node.appendChild(final);
    final.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`},{transform:'translate(0,0) scale(1)'}],{duration,easing,fill:'both'});
    final.animate([{opacity:0},{offset:.9,opacity:0},{opacity:1}],{duration,easing:'linear',fill:'both'});
   }
   const layout=[[492,167,227,262],[456,157,227,262],[426,123,227,262],[397,89,227,262],[367,123,227,262],[337,157,227,262],[308,191,227,262],[279,157,227,262],[258,123,227,262],[237,108,252,291]];
   const source=['shuxia/postcards-water.webp','lab/reverie-model.webp','lab/connect-poster-1.webp','shuxia/courtyard-poster.webp','lab/paper-in-pattern.webp','pocklet-cover.png','lab/windows-of-perception.webp','icepact-poster.webp','lab/food-on-record/cover-1.webp','lab/ambers-pulses/cover.webp'];
   const vr=video?.getBoundingClientRect();const vw=vr?.width||window.innerWidth,vh=vr?.height||window.innerHeight,scale=Math.min(vw/1920,vh/934),cw=1920*scale,ch=934*scale,ox=(vw-cw)/2,oy=(vr?.top||0)+(vh-ch)/2;
   Array.from(document.querySelectorAll<HTMLElement>('.gallery-project')).filter(el=>{const r=el.getBoundingClientRect();return r.right>0&&r.left<window.innerWidth;}).forEach((target,i)=>{
    const image=target.querySelector('img'),id=target.querySelector('.gallery-index')?.textContent?.trim();const j=({'04':7,'05':9,'01':0,'02':2,'03':5} as Record<string,number>)[id||'']??i;
    const [x,y,w,h]=layout[j],b=target.getBoundingClientRect();const card=document.createElement('div');card.className='morph-work-card';Object.assign(card.style,{left:`${b.left}px`,top:`${b.top}px`,width:`${b.width}px`,height:`${b.height}px`,zIndex:String(10+j)});
    const start=document.createElement('img');start.src='/assets/'+source[j];start.alt='';card.appendChild(start);
    const end=document.createElement('img');end.src=image?.src||'/assets/icepact-poster.webp';end.alt='';card.appendChild(end);node.appendChild(card);
    card.animate([{transform:`translate(${ox+x/960*cw-b.left}px,${oy+y/540*ch-b.top}px) scale(${w/960*cw/b.width},${h/540*ch/b.height})`},{transform:'translate(0,0) scale(1)'}],{duration,easing,fill:'both'});
    end.animate([{opacity:0},{offset:.78,opacity:0},{opacity:1}],{duration,easing:'linear',fill:'both'});
   });
  }
  setLeaving(true);setTimeout(()=>exit.current(),1750);
 };
 useEffect(()=>{const v=film.current;if(!v)return;const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;if(reduced){finish();return;}void v.play().catch(()=>{});return()=>v.pause();},[]);
 return <section ref={root} className={`trail-intro pure-intro film-intro short-opening ordered-opening personal-opening morph-opening${leaving?' is-entering-home':''}`} data-ready={ready} onTouchStart={e=>{touch.current=e.touches[0].clientY;}} onTouchEnd={e=>{if(touch.current!==null&&touch.current-e.changedTouches[0].clientY>35)finish();}} onClick={finish} onWheel={e=>{if(Math.abs(e.deltaY)>15)finish();}}>
  <video ref={film} autoPlay muted playsInline preload="auto" className="clean-opening-film" onEnded={()=>setReady(true)} aria-label="A short layered montage of selected work" poster="/assets/intro/opening-v8-start.webp"><source src="/assets/intro/opening-v8.mp4" type="video/mp4"/></video>
  <div className="bottom-opening-name" aria-label="BEIBEI ZHU">{Array.from('BEIBEI ZHU').map((c,i)=><span key={i} style={{'--i':i} as React.CSSProperties}>{c===' '?'\u00a0':c}</span>)}</div>
 </section>;
}
