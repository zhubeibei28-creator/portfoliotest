'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import './split-project.css';
const details:Record<string,{title:string;year:string;summary:string;role:string[]}>={
 '述夏SHUXIA':{title:'述夏 SHUXIA',year:'2026',summary:'A summer-inspired scent brand connecting memory, atmosphere and tactile objects. A courtyard storefront brings the identity into a space visitors can move through.',role:['Concept development','Visual identity','Illustration','Packaging','Website design','Spatial design']},
 'GRÆFT':{title:'GRÆFT',year:'2026',summary:'A fictional underground music festival exploring Jungle culture through a shared visual world, from identity and promotion to spatial experiences.',role:['Lead concept development & art direction','Visual identity','Spatial & experiential design','Motion, promotion & merchandise']},
 'POCKLET':{title:'POCKLET',year:'2025',summary:'An app and physical release kit that creates a gentle ritual for letting go of emotionally significant objects, while keeping the memories they carry.',role:['Research & concept development','Ritual & interaction design','App UX/UI','Packaging & visual design']},
 '檐行记':{title:'檐行记',year:'2025',summary:'The Eaves of Heaven. A hand-bound travelogue exploring rooflines, climate and shelter through two independent reading directions.',role:['Editorial design','Typography','Photography','Paper selection','Hand binding']},
};
export default function SplitProject({title,type,onBack,children}:{title:string;type:string;onBack:()=>void;children:ReactNode}){
 const section=useRef<HTMLElement>(null);
 useEffect(()=>{const node=section.current,sidebar=node?.querySelector('aside');if(!node||!sidebar)return;const wheel=(e:WheelEvent)=>{if(e.ctrlKey||window.innerWidth<=760)return;const article=node.querySelector('article');if(!article)return;e.preventDefault();article.scrollTop+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);};sidebar.addEventListener('wheel',wheel as EventListener,{passive:false});return()=>sidebar.removeEventListener('wheel',wheel as EventListener);},[title]);
 const info=details[title];if(!info)return children;
 return <section ref={section} className="split-detail" data-theme={title==='GRÆFT'?'dark':'light'} aria-label={`${info.title} project preview`}>
  <aside className="split-detail-sidebar">
   <button className="split-back" onClick={onBack}>← Work</button>
   <h1>{info.title}</h1>
   <p className="split-summary">{info.summary}</p>
   <dl><div><dt>YEAR</dt><dd>{info.year}</dd></div><div><dt>DISCIPLINE</dt><dd>{type}</dd></div><div><dt>MY ROLE</dt><dd><ul className="split-role-list">{info.role.map(role=><li key={role}>{role}</li>)}</ul></dd></div></dl>


  </aside>
  <div className="split-detail-content" key={title}>{children}</div>
 </section>;
}
