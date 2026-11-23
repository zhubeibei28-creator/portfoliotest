'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import './split-project.css';
import {previewText,type PreviewLanguage} from './preview-language';
const details:Record<string,{title:string;year:string;summary:string;role:string[]}>={
 '述夏SHUXIA':{title:'述夏 SHUXIA',year:'2026',summary:'A summer-inspired scent brand connecting memory, atmosphere and tactile objects. A courtyard storefront brings the identity into a space visitors can move through.',role:['Concept development','Visual identity','Illustration','Packaging','Website design','Spatial design']},
 'GRÆFT':{title:'GRÆFT',year:'2026',summary:'A fictional underground music festival exploring Jungle culture through a shared visual world, from identity and promotion to spatial experiences.',role:['Lead concept development & art direction','Visual identity','Spatial & experiential design','Motion, promotion & merchandise']},
 'POCKLET':{title:'POCKLET',year:'2025',summary:'An app and physical release kit that creates a gentle ritual for letting go of emotionally significant objects, while keeping the memories they carry.',role:['Research & concept development','Ritual & interaction design','App UX/UI','Packaging & visual design']},
 '檐行记':{title:'檐行记',year:'2025',summary:'The Eaves of Heaven. A hand-bound travelogue exploring rooflines, climate and shelter through two independent reading directions.',role:['Editorial design','Typography','Photography','Paper selection','Hand binding']},
};
export default function SplitProject({title,type,onBack,children,language='en',onLanguageChange}:{onLanguageChange?:(language:PreviewLanguage)=>void;language?:PreviewLanguage;title:string;type:string;onBack:()=>void;children:ReactNode}){
 const section=useRef<HTMLElement>(null);
 const [readingProgress,setReadingProgress]=useState(0);
 useEffect(()=>{
  const node=section.current;if(!node)return;
  let frame=0;
  const update=()=>{frame=0;const article=node.querySelector('article');if(!article)return;const overflow=getComputedStyle(article).overflowY;const scroller=overflow==='auto'||overflow==='scroll'?article:node;const remaining=scroller.scrollHeight-scroller.clientHeight;setReadingProgress(remaining>0?Math.min(1,Math.max(0,scroller.scrollTop/remaining)):0);};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  node.addEventListener('scroll',schedule,{capture:true,passive:true});window.addEventListener('resize',schedule);
  const resize=new ResizeObserver(schedule);resize.observe(node);const article=node.querySelector('article');if(article)resize.observe(article);
  setReadingProgress(0);schedule();
  return()=>{node.removeEventListener('scroll',schedule,true);window.removeEventListener('resize',schedule);resize.disconnect();cancelAnimationFrame(frame);};
 },[title]);

 useEffect(()=>{const node=section.current,sidebar=node?.querySelector('aside');if(!node||!sidebar)return;const wheel=(e:WheelEvent)=>{if(e.ctrlKey||window.innerWidth<=760)return;const article=node.querySelector('article');if(!article)return;e.preventDefault();article.scrollTop+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);};sidebar.addEventListener('wheel',wheel as EventListener,{passive:false});return()=>sidebar.removeEventListener('wheel',wheel as EventListener);},[title]);
 const t=(text:string)=>previewText(text,language);
 const info=details[title];if(!info)return children;
 return <section ref={section} className="split-detail" data-has-language={!!onLanguageChange} data-theme={title==='GRÆFT'?'dark':'light'} aria-label={`${info.title} project preview`}>
  <div className="split-reading-progress" role="progressbar" aria-label={language==='zh'?'项目阅读进度':'Project reading progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(readingProgress*100)}><span style={{transform:`scaleX(${readingProgress})`}} /></div>
  <div className="split-detail-tools"><button className="split-back" onClick={onBack}>{t('← Work')}</button>{onLanguageChange&&<div className="split-language" role="group" aria-label="Language / 语言"><button lang="en" aria-pressed={language==='en'} onClick={()=>onLanguageChange('en')}>EN</button><span>/</span><button lang="zh-CN" aria-pressed={language==='zh'} onClick={()=>onLanguageChange('zh')}>中文</button></div>}</div>
  <aside className="split-detail-sidebar">
   <div className="split-tools-spacer" aria-hidden="true"/>
   <h1>{info.title}</h1>
   <p className="split-summary">{t(info.summary)}</p>
   <dl><div><dt>{t('YEAR')}</dt><dd>{info.year}</dd></div><div><dt>{t('DISCIPLINE')}</dt><dd>{t(type)}</dd></div><div><dt>{t('MY ROLE')}</dt><dd><ul className="split-role-list">{info.role.map(role=><li key={role}>{t(role)}</li>)}</ul></dd></div></dl>


  </aside>
  <div className="split-detail-content" key={title}>{children}</div>
 </section>;
}
