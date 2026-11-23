'use client';
import Localized from './Localized';

import {useEffect,useRef} from 'react';
import {previewArt,previewProjects,type PreviewArt} from './preview-work';

export default function ProjectStage({onClose,onDetails}:{initialProject:number;initialArt?:PreviewArt;onClose:()=>void;onDetails:(index:number)=>void}){
 const stage=useRef<HTMLElement>(null);
 const close=useRef(onClose);close.current=onClose;
 useEffect(()=>{stage.current?.focus({preventScroll:true});const key=(e:KeyboardEvent)=>{if(e.key==='Escape')close.current();};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 return <Localized><section ref={stage} className="project-stage waterfall-stage" tabIndex={-1} aria-label="Project previews">
  <header className="waterfall-top"><span>Selected work / 2024—2026</span><button onClick={onClose}>Back to overview</button></header>
  {previewProjects.map((project,i)=><Localized><article className="waterfall-project" key={project.id}>
   <div className="waterfall-heading"><span>{project.id} / {project.year}</span><h2>{project.title}</h2><span>{project.type}</span></div>
   <div className="waterfall-image"><img src={previewArt[i].src} alt={previewArt[i].label} loading={i===0?'eager':'lazy'} /></div>
   <div className="waterfall-description"><p>{project.description}</p>{project.detailIndex!==null&&<button onClick={()=>onDetails(project.detailIndex!)}>Explore project ↗</button>}</div>
  </article></Localized>)}
  <footer className="waterfall-end"><button onClick={onClose}>Back to overview ↗</button></footer>
 </section></Localized>;
}
