'use client';
import Localized from './Localized';

import {useEffect,useRef,useState,type RefObject} from 'react';
import './project-section-nav.css';
export default function ProjectSectionNav({root,items}:{root:RefObject<HTMLElement|null>;items:string[][]}){
 const nav=useRef<HTMLElement>(null),[active,setActive]=useState(items[0][0]);
 const ids=items.map(item=>item[0]).join('|');
 useEffect(()=>{const article=root.current;if(!article)return;const host=article.closest('.split-detail')||article;let frame=0;const update=()=>{frame=0;const line=(nav.current?.getBoundingClientRect().bottom||0)+32;let current=ids.split('|')[0];for(const id of ids.split('|')){const target=article.querySelector<HTMLElement>(`#${id}`);if(target&&target.getBoundingClientRect().top<=line)current=id;}setActive(current);};const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};host.addEventListener('scroll',schedule,{capture:true,passive:true});window.addEventListener('resize',schedule);const observer=new ResizeObserver(schedule);observer.observe(article);schedule();return()=>{host.removeEventListener('scroll',schedule,true);window.removeEventListener('resize',schedule);observer.disconnect();cancelAnimationFrame(frame);};},[root,ids]);
 return <Localized><nav ref={nav} className="project-section-nav" aria-label="Project sections">{items.map(([id,label],index)=><Localized key={id}><a href={`#${id}`} aria-current={active===id?'location':undefined} onClick={event=>{event.preventDefault();const article=root.current,target=article?.querySelector<HTMLElement>(`#${id}`);if(!article||!target)return;const header=document.querySelector<HTMLElement>('.persistent-header');const offset=header&&target.getBoundingClientRect().top<(nav.current?.getBoundingClientRect().top||0)?header.getBoundingClientRect().height:0;target.style.scrollMarginTop=`${offset+(nav.current?.offsetHeight||0)+16}px`;target.scrollIntoView({block:'start',behavior:'instant'});setActive(id);}}><span>{String(index+1).padStart(2,'0')}</span> {label}</a></Localized>)}</nav></Localized>;
}
