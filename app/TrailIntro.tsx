'use client';
import {useEffect,useRef,useState} from 'react';
import './trail-intro.css';

export default function TrailIntro({onOriginal}:{onOriginal:()=>void}){
 const film=useRef<HTMLVideoElement>(null);
 const root=useRef<HTMLElement>(null);
 const [leaving,setLeaving]=useState(false);
 const exited=useRef(false);
 const exit=useRef(onOriginal);exit.current=onOriginal;
 const finish=()=>{
  if(exited.current)return;exited.current=true;
  const targets=Array.from(document.querySelectorAll<HTMLElement>('.gallery-project')).filter(el=>{const r=el.getBoundingClientRect();return r.right>0&&r.left<window.innerWidth;});
  const node=root.current;
  if(node)targets.forEach((target,i)=>{
   const rect=target.getBoundingClientRect(),image=document.createElement('img');
   image.src=target.querySelector('img')?.src||'/assets/icepact-poster.webp';image.alt='';image.className='opening-bridge';
   const size=Math.min(window.innerWidth*.25,340),x=window.innerWidth*.5-size*.5+(i-2)*22,y=window.innerHeight*.5-size*.5+(i-2)*12;
   Object.assign(image.style,{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,zIndex:String(10+i)});node.appendChild(image);
   image.animate([{transform:`translate(${x-rect.left}px,${y-rect.top}px) scale(${size/rect.width},${size/rect.height})`,opacity:0},{offset:.12,opacity:1},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:950,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
  });
  setLeaving(true);setTimeout(()=>exit.current(),980);
 };
 useEffect(()=>{const v=film.current;if(!v)return;const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;if(reduced){finish();return;}void v.play().catch(()=>{});return()=>v.pause();},[]);
 return <section ref={root} className={`trail-intro pure-intro film-intro short-opening${leaving?' is-joining':''}`} onClick={finish} onWheel={e=>{if(Math.abs(e.deltaY)>15)finish();}}>
  <video ref={film} autoPlay muted playsInline preload="auto" className="clean-opening-film" onEnded={finish} aria-label="A short layered montage of selected work" poster="/assets/intro/opening-v5-start.webp"><source src="/assets/intro/opening-v5.mp4" type="video/mp4"/></video>
  <div className="bottom-opening-name" aria-label="BEIBEI ZHU">{Array.from('BEIBEI ZHU').map((c,i)=><span key={i} style={{'--i':i} as React.CSSProperties}>{c===' '?'\u00a0':c}</span>)}</div>
 </section>;
}
