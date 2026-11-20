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
  setLeaving(true);setTimeout(()=>exit.current(),1300);
 };
 useEffect(()=>{const v=film.current;if(!v)return;const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;if(reduced){finish();return;}void v.play().catch(()=>{});return()=>v.pause();},[]);
 return <section ref={root} className={`trail-intro pure-intro film-intro short-opening ordered-opening${leaving?' is-leaving':''}`} onClick={finish} onWheel={e=>{if(Math.abs(e.deltaY)>15)finish();}}>
  <video ref={film} autoPlay muted playsInline preload="auto" className="clean-opening-film" onEnded={finish} aria-label="A short layered montage of selected work" poster="/assets/intro/opening-v6-start.webp"><source src="/assets/intro/opening-v6.mp4" type="video/mp4"/></video>
  <div className="bottom-opening-name" aria-label="BEIBEI ZHU">{Array.from('BEIBEI ZHU').map((c,i)=><span key={i} style={{'--i':i} as React.CSSProperties}>{c===' '?'\u00a0':c}</span>)}</div>
 </section>;
}
