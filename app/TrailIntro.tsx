'use client';
import { useEffect, useRef, useState } from 'react';
import {previewArt,previewProjects,type PreviewArt} from './preview-work';
import './trail-intro.css';

export default function TrailIntro({onOriginal,onBrowse,skipOpening=false,onReady}:{onOriginal:()=>void;onBrowse:(project:number,art?:PreviewArt)=>void;skipOpening?:boolean;onReady:()=>void}) {
 const [replay,setReplay]=useState(0);
 const [settled,setSettled]=useState(skipOpening);
 const field=useRef<HTMLDivElement>(null);
 const cards=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{
  const node=field.current;if(!node)return;
  let disposed=false,booted=false;
  let animations:Animation[]=[];
  let lastWidth=0,lastHeight=0;
  const start=performance.now();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layout=(animate:boolean)=>{
   animations.forEach(a=>a.cancel());animations=[];
   const box=node.getBoundingClientRect();lastWidth=box.width;lastHeight=box.height;
   const count=window.matchMedia('(max-width:620px)').matches?5:previewArt.length;
   const first=cards.current[0];if(!first)return;
   const radiusX=(box.width-first.offsetWidth)*.48;
   const radiusY=Math.max(40,(box.height-first.offsetHeight)*.44);
   cards.current.forEach((card,i)=>{
    if(!card)return;
    card.style.display=i<count?'':'none';if(i>=count)return;
    const angle=(-90+i*360/count)*Math.PI/180;
    const x=Math.cos(angle)*radiusX,y=Math.sin(angle)*radiusY;
    const final=`translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),0)`;
    card.style.transform=final;card.style.opacity='1';card.style.zIndex=String(300+Math.round(y));
    if(!animate)return;
    const frames=Array.from({length:33},(_,n)=>{
     const u=n/32,r=.30+.70*u,a=angle-(1-u)*110*Math.PI/180;
     return {offset:u,opacity:Math.min(1,u/.12),transform:`translate3d(calc(-50% + ${Math.cos(a)*radiusX*r}px),calc(-50% + ${Math.sin(a)*radiusY*r}px),0) scale(${.88+.12*u})`};
    });
    const animation=card.animate(frames,{duration:2150,delay:Math.max(0,2350+i*65-(performance.now()-start)),easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
    animations.push(animation);
   });
   if(animate){
    setSettled(false);
    void Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{
     if(disposed)return;
     cards.current.forEach(card=>{if(card)card.getAnimations().forEach(a=>a.cancel());});
     setSettled(true);onReady();
    });
   }else{setSettled(true);onReady();}
  };
  const observer=new ResizeObserver(()=>{
   if(!booted)return;
   const box=node.getBoundingClientRect();
   if(Math.abs(box.width-lastWidth)>2||Math.abs(box.height-lastHeight)>2)layout(false);
  });observer.observe(node);
  const decoded=cards.current.map(card=>card?.querySelector('img')?.decode().catch(()=>{}));
  void Promise.all(decoded).then(()=>{if(disposed)return;layout(!reduced&&(!skipOpening||replay>0));booted=true;});
  return()=>{disposed=true;observer.disconnect();animations.forEach(a=>a.cancel());};
 },[replay]);
 return <section className="trail-intro" data-settled={settled}>
  <h1 className="trail-headline"><span>Independent graphic designer.</span><span>Identity, image &amp; print.</span></h1>
  {(!skipOpening||replay>0)&&<div key={replay} className="orbit-name" aria-hidden="true">{Array.from('Beibei Zhu').map((c,i)=><span key={i} style={{'--letter':i} as React.CSSProperties}>{c===' '?'\u00a0':c}</span>)}</div>}
  <div ref={field} className="orbit-field" aria-label="Explore projects">{previewArt.map((art,i)=><button key={art.src} ref={el=>{cards.current[i]=el;}} className="orbit-card" aria-label={`Open ${previewProjects[art.project].title} / ${art.label}`} onClick={()=>onBrowse(art.project,art)}>
   <img className="orbit-art" src={art.thumb} alt={art.label} draggable={false} decoding="async" />
   <span className="orbit-caption"><b>{previewProjects[art.project].title}</b><span>{art.label}</span></span>
  </button>)}</div>
  <div className="trail-side"><p>New York / Shanghai.</p><span>2024—2026</span></div>
  <div className="trail-bottom"><div><button onClick={onOriginal}>View original homepage</button><button onClick={()=>{setSettled(false);setReplay(v=>v+1);}}>Replay opening</button></div><button onClick={()=>onBrowse(0)}>View projects</button></div>
 </section>;
}
