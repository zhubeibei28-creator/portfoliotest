'use client';
import { useEffect, useRef } from 'react';
import './trail-intro.css';

export default function TrailIntro({onOriginal}:{onOriginal:()=>void}) {
 const root=useRef<HTMLElement>(null);
 const film=useRef<HTMLVideoElement>(null);
 const syncPhase=()=>{
  if(!root.current||!film.current)return;
  const phase=film.current.currentTime<2.85?'true':'false';
  if(root.current.dataset.namePhase!==phase)root.current.dataset.namePhase=phase;
 };
 useEffect(()=>{
  const video=film.current;if(!video)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ready=()=>{
   if(reduced){video.pause();video.currentTime=7.7;}
   else void video.play().catch(()=>{if(root.current)root.current.dataset.namePhase='false';});
  };
  if(video.readyState>=2)ready();else video.addEventListener('canplay',ready,{once:true});
  return()=>{video.removeEventListener('canplay',ready);video.pause();};
 },[]);
 return <section ref={root} className="trail-intro" data-name-phase="true">
  <h1 className="trail-headline"><span>Independent graphic designer.</span><span>Identity, image &amp; print.</span></h1>
  <video ref={film} className="opening-film" autoPlay loop muted playsInline preload="auto" poster="/assets/intro/opening-v3-start.webp" aria-label="Beibei Zhu opening: a letter-by-letter name reveal, followed by an expanding montage of selected projects" onTimeUpdate={syncPhase} onError={()=>{if(root.current)root.current.dataset.namePhase='false';}}>
   <source src="/assets/intro/opening-v3.mp4" type="video/mp4" />
  </video>
  <div className="trail-side"><p>New York / Shanghai.</p><span>2024—2026</span></div>
  <div className="trail-bottom"><div><button onClick={onOriginal}>View original homepage</button><button onClick={()=>{const v=film.current;if(v){v.currentTime=0;syncPhase();void v.play();}}}>Replay opening</button></div><button onClick={()=>document.querySelector('.selected-grid')?.scrollIntoView({behavior:'smooth'})}>View projects</button></div>
 </section>;
}
