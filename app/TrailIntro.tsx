'use client';
import { useEffect, useRef, useState } from 'react';
import './trail-intro.css';

const images=Array.from({length:6},(_,i)=>`/assets/intro/work-${i}.webp`);
const offsets=[[-48,10,18,-22],[18,-32,30,18],[-17,29,-24,10],[46,8,-15,-24],[4,-13,35,24],[31,37,-28,20]];
export default function TrailIntro({onOriginal}:{onOriginal:()=>void}) {
 const [replay,setReplay]=useState(0);
 const stage=useRef<HTMLDivElement>(null);
 const frame=useRef(0);
 const pointer=useRef({x:0,y:0});
 const reduced=useRef(false);
 useEffect(()=>{
  reduced.current=window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches;
  return()=>cancelAnimationFrame(frame.current);
 },[]);
 const move=(e:React.PointerEvent<HTMLElement>)=>{
  if(e.pointerType!=='mouse'||reduced.current)return;
  const box=e.currentTarget.getBoundingClientRect();
  pointer.current={x:((e.clientX-box.left)/box.width-.5)*38,y:((e.clientY-box.top)/box.height-.5)*24};
  if(!frame.current)frame.current=requestAnimationFrame(()=>{
   frame.current=0;
   if(stage.current)stage.current.style.transform=`translate3d(${pointer.current.x}px,${pointer.current.y}px,0)`;
  });
 };
 return <section className="trail-intro" onPointerMove={move} onPointerLeave={()=>{
  if(stage.current)stage.current.style.transform='translate3d(0,0,0)';
 }}>
  <h1 className="trail-headline"><span>Independent graphic designer.</span><span>Identity, image &amp; print.</span></h1>
  <div ref={stage} className="opening-stage" aria-hidden="true">
   <div key={replay} className="opening-sequence">
    {images.map((src,i)=><img key={src} className="opening-card" src={src} alt="" draggable={false} decoding="async" style={{zIndex:12-i,animationDelay:`${i*.13}s`,'--card-x':`${offsets[i][0]}px`,'--card-y':`${offsets[i][1]}px`,'--exit-x':`${offsets[i][2]}px`,'--exit-y':`${offsets[i][3]}px`} as React.CSSProperties}/>)}
    <span className="opening-name">Beibei Zhu</span>
   </div>
  </div>
  <div className="trail-side"><p>Selected work, 2024—2026.<br/>New York / Shanghai.</p><span className="trail-hint">Identity. Objects. Spaces.</span></div>
  <div className="trail-bottom"><div><button onClick={onOriginal}>View original homepage</button><button onClick={()=>setReplay(v=>v+1)}>Replay opening</button></div><button onClick={()=>document.querySelector('.selected-grid')?.scrollIntoView({behavior:'smooth'})}>Explore selected work ↓</button></div>
 </section>;
}
