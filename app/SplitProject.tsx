'use client';
import type {ReactNode} from 'react';
import './split-project.css';
const details:Record<string,{title:string;year:string;summary:string;role:string;colors?:[string,string][]}>={
 '述夏SHUXIA':{title:'述夏 SHUXIA',year:'2026',summary:'A summer-inspired scent brand connecting memory, atmosphere and tactile objects. A courtyard storefront brings the identity into a space visitors can move through.',role:'Concept development, visual identity, illustration, packaging, website and spatial design.',colors:[['Paper','#E5DDD4'],['Summer green','#9BD3AE'],['Rain blue','#728E9B'],['Coral','#E58469']]},
 'GRÆFT':{title:'GRÆFT',year:'2024',summary:'A fictional underground music festival exploring Jungle culture through a shared visual world, from identity and promotion to spatial experiences.',role:'Concept development and visual direction, visual identity, spatial applications and promotional materials.',colors:[['Black','#000000'],['Acid green','#88ED4D']]},
 'POCKLET':{title:'POCKLET',year:'2025',summary:'An app and physical release kit that creates a gentle ritual for letting go of emotionally significant objects, while keeping the memories they carry.',role:'Research, experience design, UX/UI, packaging and visual design.'},
 '檐行记':{title:'檐行记',year:'2025',summary:'The Eaves of Heaven. A hand-bound travelogue exploring rooflines, climate and shelter through two independent reading directions.',role:'Editorial design, typography, photography, paper selection and hand binding.'},
};
export default function SplitProject({title,type,onBack,children}:{title:string;type:string;onBack:()=>void;children:ReactNode}){
 const info=details[title];if(!info)return children;
 return <section className="split-detail" aria-label={`${info.title} project preview`}>
  <aside className="split-detail-sidebar">
   <button className="split-back" onClick={onBack}>← Work</button>
   <h1>{info.title}</h1><p className="split-discipline">{type}</p>
   <p className="split-summary">{info.summary}</p>
   <dl><div><dt>YEAR</dt><dd>{info.year}</dd></div><div><dt>DISCIPLINE</dt><dd>{type}</dd></div><div><dt>MY ROLE</dt><dd>{info.role}</dd></div></dl>
   {info.colors&&<div className="split-colors" aria-label="Project colors">{info.colors.map(([name,color])=><div key={color}><i style={{background:color}}/><span>{name}</span><small>{color}</small></div>)}</div>}
   <p className="split-scroll-note">Scroll to explore the project ↓</p>
  </aside>
  <div className="split-detail-content" key={title}>{children}</div>
 </section>;
}
