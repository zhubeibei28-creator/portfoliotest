'use client';
import { useEffect, useRef } from 'react';
import './trail-intro.css';

const images=Array.from({length:6},(_,i)=>`/assets/intro/work-${i}.webp`);
export default function TrailIntro({onOriginal}:{onOriginal:()=>void}) {
 const cards=useRef<(HTMLImageElement|null)[]>([]);
 const stage=useRef<HTMLDivElement>(null);
 const frame=useRef(0);
 const pointer=useRef({x:0,y:0,lastX:0,lastY:0,time:0,index:0,ready:false});
 const reduced=useRef(false);
 useEffect(()=>{
  reduced.current=window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches;
  return()=>cancelAnimationFrame(frame.current);
 },[]);
 const update=()=>{
  frame.current=0;
  const c=pointer.current;
  if(stage.current)stage.current.style.transform=`translate3d(${c.x}px,${c.y}px,0)`;
  cards.current.forEach((el,i)=>{
   if(!el)return;
   const depth=(i-c.index+images.length)%images.length;
   el.style.zIndex=String(20-depth);
   el.style.opacity=depth<5?'1':'0';
   el.style.transform=`translate3d(calc(-50% + ${depth*15}px),calc(-50% + ${depth*11}px),0)`;
  });
 };
 const move=(e:React.PointerEvent<HTMLElement>)=>{
  if(e.pointerType!=='mouse'||reduced.current)return;
  const box=e.currentTarget.getBoundingClientRect(),c=pointer.current,now=performance.now();
  c.x=(Math.min(1,Math.max(0,(e.clientX-box.left)/box.width))-.5)*box.width*.26;
  c.y=(Math.min(1,Math.max(0,(e.clientY-box.top)/box.height))-.5)*box.height*.2;
  if(!c.ready||(Math.hypot(e.clientX-c.lastX,e.clientY-c.lastY)>105&&now-c.time>170)){
   c.index=(c.index+1)%images.length;c.lastX=e.clientX;c.lastY=e.clientY;c.time=now;c.ready=true;
  }
  if(!frame.current)frame.current=requestAnimationFrame(update);
 };
 return <section className="trail-intro" onPointerMove={move} onPointerLeave={()=>{
  const c=pointer.current;c.x=0;c.y=0;c.ready=false;
  if(!frame.current)frame.current=requestAnimationFrame(update);
 }}>
  <h1 className="trail-headline"><span>Independent graphic designer.</span><span>Identity, image &amp; print.</span></h1>
  <div ref={stage} className="trail-stack" aria-hidden="true">
   {images.map((src,i)=><img key={src} src={src} ref={el=>{cards.current[i]=el;}} alt="" draggable={false} decoding="async" style={{zIndex:20-i,opacity:i<5?1:0,transform:`translate3d(calc(-50% + ${i*15}px),calc(-50% + ${i*11}px),0)`}}/>)}
   <span className="trail-signature">Beibei Zhu</span>
  </div>
  <div className="trail-side"><p>Selected work, 2024—2026.<br/>New York / Shanghai.</p><span className="trail-hint">Move to browse</span></div>
  <div className="trail-bottom"><button onClick={onOriginal}>View original homepage</button><button onClick={()=>document.querySelector('.selected-grid')?.scrollIntoView({behavior:'smooth'})}>Explore selected work ↓</button></div>
 </section>;
}
