'use client';
import { useEffect, useRef, useState } from 'react';
import './trail-intro.css';

export default function TrailIntro({onOriginal}:{onOriginal:()=>void}) {
 const [phase,setPhase]=useState<'intro'|'idle'>('intro');
 const intro=useRef<HTMLVideoElement>(null);
 const idle=useRef<HTMLVideoElement>(null);
 const reduced=useRef(false);
 const beginIdle=()=>{
  setPhase('idle');
  if(idle.current&&!reduced.current)void idle.current.play().catch(()=>{});
 };
 useEffect(()=>{
  const video=intro.current;if(!video)return;
  reduced.current=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced.current){setPhase('idle');return;}
  const ready=()=>{void video.play().catch(()=>beginIdle());};
  if(video.readyState>=2)ready();else video.addEventListener('canplay',ready,{once:true});
  return()=>{video.removeEventListener('canplay',ready);video.pause();idle.current?.pause();};
 },[]);
 return <section className="trail-intro" data-phase={phase}>
  <h1 className="trail-headline"><span>Independent graphic designer.</span><span className="trail-location">New York / Shanghai</span></h1>
  <div className="opening-stage">
   <video ref={intro} className="opening-film opening-film-intro" muted playsInline preload="auto" poster="/assets/intro/opening-personal-start.webp" aria-hidden={phase!=='intro'} aria-label="Beibei Zhu: a quiet introduction followed by a selection of printed and spatial work" onEnded={beginIdle} onError={beginIdle}>
    <source src="/assets/intro/opening-personal.mp4" type="video/mp4" />
   </video>
   <video ref={idle} className="opening-film opening-film-idle" loop muted playsInline preload="auto" poster="/assets/intro/opening-personal-poster.webp" aria-label="A slowly changing selection of Beibei’s work" aria-hidden={phase!=='idle'}>
    <source src="/assets/intro/opening-personal-idle.mp4" type="video/mp4" />
   </video>
  </div>
  <div className="trail-year"><img src="/favicon.svg?v=apple" alt="" aria-hidden="true"/><span>2024—2026</span></div>
  <div className="trail-bottom"><div><button onClick={onOriginal}>View original homepage</button><button onClick={()=>{
   const video=intro.current;if(!video)return;
   idle.current?.pause();video.currentTime=0;setPhase('intro');void video.play();
  }}>Replay opening</button></div><button className="trail-explore" onClick={()=>document.querySelector('.selected-grid')?.scrollIntoView({behavior:'smooth'})}>Take a look</button></div>
 </section>;
}
