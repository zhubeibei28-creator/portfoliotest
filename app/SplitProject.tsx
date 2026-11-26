'use client';
import Localized from './Localized';

import {useEffect,useRef,type ReactNode} from 'react';
import './split-project.css';
import {previewText,type PreviewLanguage} from './preview-language';
const details:Record<string,{title:string;year:string;project:string[];summary:string;role:string[]}>={
 '述夏SHUXIA':{title:'述夏 SHUXIA',year:'2026',project:['Independent','Brand concept'],summary:'Shu Xia is a soap-led fragrance brand inspired by the scents and everyday rituals of summer. Beginning with a collection of scented soaps, the brand extends its signature fragrances into mists and thoughtfully designed lifestyle objects, bringing the sensory memories of summer into everyday life.',role:['Concept development','Visual identity','Illustration','Packaging','Website design','Spatial design']},
 'GRÆFT':{title:'GRÆFT',year:'2026',project:['Collaborative Project'],summary:'A fictional underground music festival exploring Jungle culture through a shared visual world, from identity and promotion to spatial experiences.',role:['Lead concept development & art direction','Visual identity','Spatial & experiential design','Motion, promotion & merchandise']},
 'POCKLET':{title:'POCKLET',year:'2025',project:['Independent project','UX/UI & experience design'],summary:'An app and physical release kit that creates a gentle ritual for letting go of emotionally significant objects, while keeping the memories they carry.',role:['Research & concept development','Ritual & interaction design','App UX/UI','Packaging & visual design']},
 '檐行记':{title:'檐行记',year:'2025',project:['Travelogue / Editorial design','Semester-long project'],summary:'The Eaves of Heaven. A hand-bound travelogue exploring rooflines, climate and shelter through two independent reading directions.',role:['Editorial design','Typography','Photography','Paper selection','Hand binding']},
};
export default function SplitProject({title,type,onBack,children,language='en',onLanguageChange}:{onLanguageChange?:(language:PreviewLanguage)=>void;language?:PreviewLanguage;title:string;type:string;onBack:()=>void;children:ReactNode}){
 const section=useRef<HTMLElement>(null);
 useEffect(()=>{const node=section.current,sidebar=node?.querySelector('aside');if(!node||!sidebar)return;const wheel=(e:WheelEvent)=>{if(e.ctrlKey||window.innerWidth<=760)return;const article=node.querySelector('article');if(!article)return;e.preventDefault();article.scrollTop+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);};sidebar.addEventListener('wheel',wheel as EventListener,{passive:false});return()=>sidebar.removeEventListener('wheel',wheel as EventListener);},[title]);
 const t=(text:string)=>previewText(text,language);
 const info=details[title];if(!info)return children;
 const summary=t(info.summary);const sentences=summary.match(/[^.!?。！？]+[.!?。！？]?/gu)||[summary];
 return <Localized><section ref={section} className="split-detail" data-has-language={!!onLanguageChange} data-theme={title==='GRÆFT'?'dark':'light'} aria-label={`${info.title} project preview`}>

  <div className="split-detail-tools"><button className="split-back" onClick={onBack}>{t('← Work')}</button>{onLanguageChange&&<div className="split-language" role="group" aria-label="Language / 语言"><button lang="en" aria-pressed={language==='en'} onClick={()=>onLanguageChange('en')}>EN</button><span>/</span><button lang="zh-CN" aria-pressed={language==='zh'} onClick={()=>onLanguageChange('zh')}>中文</button></div>}</div>
  <aside className="split-detail-sidebar">
   <div className="split-tools-spacer" aria-hidden="true"/>
   <h1>{info.title}</h1>
   <div className="split-summary"><p>{sentences[0].trim()}</p>{sentences.length>1&&<p>{sentences.slice(1).join(language==='zh'?'':' ').trim()}</p>}</div>
   <dl><div><dt>{t('YEAR')}</dt><dd>{info.year}</dd></div><div><dt>{t('PROJECT')}</dt><dd>{info.project.map(line=><div key={line}>{t(line)}</div>)}</dd></div><div><dt>{t('MY ROLE')}</dt><dd><ul className="split-role-list">{info.role.map(role=><Localized key={role}><li>{t(role)}</li></Localized>)}</ul></dd></div></dl>


  </aside>
  <div className="split-detail-content" key={title}>{children}</div>
 </section></Localized>;
}
