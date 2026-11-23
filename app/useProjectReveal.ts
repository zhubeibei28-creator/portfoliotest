'use client';
import {useEffect,type RefObject} from 'react';
import './project-reveal.css';

/** One-time reveals work with either an article scroller or the portrait page. */
export default function useProjectReveal(root:RefObject<HTMLElement|null>){
 useEffect(()=>{
  const node=root.current;
  if(!node||!('IntersectionObserver' in window))return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches)return;
  const selector='.sx-section-heading h2,.sx-section-heading>p,.sx-overview-copy p,.sx-description>p,.sx-description>h3,.sx-description>h4,.gf-section-heading,.gf-subheading,.gf-overview>div:first-child,.pk-section-head,.pk-overview>div:first-child,.pk-bcam-intro,.pk-bcam-takeaway,.pk-process-intro,.pk-testing-heading,.yan-note,.yan-opening-copy,.yan-film-caption,[data-reveal-photo]';
  const candidates=Array.from(node.querySelectorAll<HTMLElement>(selector));
  const images=Array.from(node.querySelectorAll<HTMLImageElement>('img')).filter(el=>!el.closest('[role="dialog"],.sx-lightbox,.gf-lightbox,.pk-lightbox,.yan-lightbox,[data-reveal-photo]'));
  candidates.push(...images);
  const targets=candidates.filter(el=>!candidates.some(parent=>parent!==el&&parent.contains(el)));
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting||!entry.target.getBoundingClientRect().height)continue;
    entry.target.setAttribute('data-revealed','true');
    observer.unobserve(entry.target);
   }
  },{threshold:0,rootMargin:'0px 0px -12% 0px'});
  const onImageLoad=(event:Event)=>{const image=event.currentTarget as HTMLImageElement;if(image.classList.contains('project-reveal')&&!image.hasAttribute('data-revealed')){observer.unobserve(image);observer.observe(image);}};
  images.forEach(image=>image.addEventListener('load',onImageLoad));
  const viewportBottom=Math.min(window.innerHeight,node.getBoundingClientRect().bottom);
  for(const el of targets){
   const rect=el.getBoundingClientRect();
   // Leave the initial viewport and hidden layout variants untouched.
   if(el.tagName!=='IMG'&&!rect.height)continue;
   if(rect.height&&rect.top<viewportBottom)continue;
   el.classList.add('project-reveal');
   if(el.tagName==='IMG'){
    el.classList.add('project-reveal-image');
    const peers=images.filter(other=>other!==el&&Math.abs(other.getBoundingClientRect().top-rect.top)<24&&other.getBoundingClientRect().left<rect.left);
    el.style.setProperty('--reveal-delay',`${Math.min(peers.length,3)*110}ms`);
   }
   observer.observe(el);
  }
  const showAll=()=>{if(motion.matches){targets.forEach(el=>el.setAttribute('data-revealed','true'));observer.disconnect();}};
  motion.addEventListener('change',showAll);
  return()=>{images.forEach(image=>image.removeEventListener('load',onImageLoad));observer.disconnect();motion.removeEventListener('change',showAll);targets.forEach(el=>{el.classList.remove('project-reveal','project-reveal-image');if(el.tagName==='IMG')el.style.removeProperty('--reveal-delay');el.removeAttribute('data-revealed');});};
 },[root]);
}
