'use client';
import {useEffect,useRef,useState} from 'react';
import './trail-intro.css';

export default function TrailIntro({onOriginal}:{onOriginal:()=>void}){
 const film=useRef<HTMLVideoElement>(null);
 const [leaving,setLeaving]=useState(false);
 const exited=useRef(false);
 const exit=useRef(onOriginal);exit.current=onOriginal;
 const finish=()=>{if(exited.current)return;exited.current=true;setLeaving(true);setTimeout(()=>exit.current(),600);};
 useEffect(()=>{const v=film.current;if(!v)return;void v.play().catch(()=>{});return()=>v.pause();},[]);
 return <section className={`trail-intro pure-intro film-intro${leaving?' is-leaving':''}`} onClick={finish} onWheel={e=>{if(Math.abs(e.deltaY)>15)finish();}}>
  <video ref={film} autoPlay muted playsInline preload="auto" className="clean-opening-film" onEnded={finish} aria-label="BEIBEI ZHU opening with a layered montage of selected work" poster="/assets/intro/opening-v4-start.webp"><source src="/assets/intro/opening-v4.mp4" type="video/mp4"/></video>
 </section>;
}
