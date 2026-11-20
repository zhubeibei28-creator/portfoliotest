'use client';
import { useEffect, useRef, useState } from 'react';
import { previewArt,previewProjects,type PreviewArt } from './preview-work';

export default function ProjectStage({initialProject,initialArt,onClose,onDetails}:{initialProject:number;initialArt?:PreviewArt;onClose:()=>void;onDetails:(index:number)=>void}){
 const [index,setIndex]=useState(initialProject);
 const [loadedSrc,setLoadedSrc]=useState('');
 const current=useRef(initialProject);
 const close=useRef(onClose);close.current=onClose;
 const stage=useRef<HTMLElement>(null);
 const touch=useRef<{x:number;y:number}|null>(null);
 const project=previewProjects[index];
 const art=initialArt&&index===initialProject?initialArt:previewArt[index];
 const go=(next:number)=>{const n=(next+previewProjects.length)%previewProjects.length;current.current=n;setIndex(n);};
 useEffect(()=>{
  const node=stage.current;if(!node)return;
  const previousFocus=document.activeElement;
  node.focus({preventScroll:true});
  previewArt.slice(0,5).forEach(art=>{const image=new Image();image.src=art.src;});
  let lastWheel=0,lastStep=0,used=false,travel=0;
  const wheel=(e:WheelEvent)=>{
   if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
   e.preventDefault();e.stopPropagation();
   const now=performance.now();
   if(now-lastWheel>180){used=false;travel=0;}
   lastWheel=now;
   if(used||now-lastStep<650)return;
   travel+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);
   if(Math.abs(travel)>=28){go(current.current+(travel>0?1:-1));lastStep=now;used=true;travel=0;}
  };
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();close.current();}
   else if(['ArrowDown','ArrowRight','PageDown'].includes(e.key)){e.preventDefault();go(current.current+1);}
   else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(current.current-1);}
  };
  node.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',key);
  return()=>{node.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key);if(previousFocus instanceof HTMLElement&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});};
 },[]);
 return <section ref={stage} className="project-stage" tabIndex={-1} aria-label="Large project viewer">
  <header className="project-stage-top"><span aria-live="polite">{project.id} / 05</span><button onClick={onClose}>Back to overview</button></header>
  <nav className="project-stage-index" aria-label="Choose a project">{previewProjects.map((p,i)=><button key={p.id} onClick={()=>go(i)} aria-current={i===index?'true':undefined}><span>{p.id}</span>{p.title}</button>)}</nav>
  <div className="project-stage-media" key={art.src} onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{
   const start=touch.current;touch.current=null;if(!start)return;
   const dy=start.y-e.changedTouches[0].clientY,dx=start.x-e.changedTouches[0].clientX;
   if(Math.abs(dy)>45&&Math.abs(dy)>Math.abs(dx))go(current.current+(dy>0?1:-1));
  }}>
   <img className="project-stage-thumb" src={art.thumb} alt="" aria-hidden="true" />
   <img className={`project-stage-full${loadedSrc===art.src?' is-loaded':''}`} src={art.src} alt={`${project.title} / ${art.label}`} onLoad={()=>setLoadedSrc(art.src)} />
  </div>
  <footer className="project-stage-bottom"><div className="project-stage-controls"><button onClick={()=>go(index-1)}>Previous</button><button onClick={()=>go(index+1)}>Next</button><span>Scroll to switch projects</span></div><div className="project-stage-description"><span>{project.type}</span>{project.detailIndex!==null&&<button onClick={()=>onDetails(project.detailIndex!)}>Explore project</button>}</div></footer>
 </section>;
}
