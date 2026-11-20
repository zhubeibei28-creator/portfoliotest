'use client';
import { useEffect, useRef } from 'react';
import './trail-intro.css';

const images = [
 '/assets/shuxia/home-postcards-cover.webp',
 '/assets/graft/hero.webp',
 '/assets/roofbook-cover-two-spreads-v7.png',
 '/assets/pocklet-cover.png',
 '/assets/shuxia/soap-set.webp',
 '/assets/graft/tile-logo-wall.webp',
 '/assets/shuxia/postcards-water.webp',
 '/assets/graft/chrome-logo-original.png',
];
export default function TrailIntro({onOriginal}:{onOriginal:()=>void}) {
 const cards=useRef<(HTMLImageElement|null)[]>([]);
 const cursor=useRef({x:0,y:0,time:0,index:0,z:0,ready:false});
 const animations=useRef<Animation[]>([]);
 useEffect(()=>{images.forEach(src=>{const image=new Image();image.src=src;});return()=>animations.current.forEach(a=>a.cancel());},[]);
 const move=(e:React.PointerEvent<HTMLElement>)=>{
  if(e.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const box=e.currentTarget.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;
  const c=cursor.current,now=performance.now();
  if(c.ready&&(Math.hypot(x-c.x,y-c.y)<65||now-c.time<65))return;
  const i=c.index%12,el=cards.current[i];if(!el)return;
  animations.current[i]?.cancel();
  el.src=images[c.index%images.length];el.style.left=`${x}px`;el.style.top=`${y}px`;el.style.zIndex=String(++c.z);
  const angle=[-8,5,-3,9,-6,3][c.index%6];
  animations.current[i]=el.animate([
   {opacity:0,transform:`translate(-50%,-42%) rotate(${angle-3}deg) scale(.88)`,filter:'blur(3px)',offset:0},
   {opacity:1,transform:`translate(-50%,-50%) rotate(${angle}deg) scale(1)`,filter:'blur(0)',offset:.13},
   {opacity:1,transform:`translate(-50%,-53%) rotate(${angle}deg) scale(1)`,filter:'blur(0)',offset:.48},
   {opacity:0,transform:`translate(-50%,-65%) rotate(${angle+2}deg) scale(.96)`,filter:'blur(3px)',offset:1}
  ],{duration:1900,easing:'cubic-bezier(.2,.65,.3,1)',fill:'forwards'});
  Object.assign(c,{x,y,time:now,index:c.index+1,ready:true});
 };
 return <section className="trail-intro" onPointerMove={move} onPointerLeave={()=>{cursor.current.ready=false;}}>
  <div className="trail-top"><span>Independent graphic designer</span><button onClick={onOriginal}>View original homepage</button></div>
  <h1>Working across<br/>identity, image<br/>&amp; print.</h1>
  <div className="trail-images" aria-hidden="true">{Array.from({length:12},(_,i)=><img key={i} ref={el=>{cards.current[i]=el;}} alt="" draggable={false}/>)}</div>
  <div className="trail-bottom"><span className="trail-hint">Move your cursor to explore</span><span>New York / Shanghai</span><button onClick={()=>document.querySelector('.selected-grid')?.scrollIntoView({behavior:'smooth'})}>Selected work ↓</button></div>
  <div className="trail-mobile" aria-hidden="true"><img src={images[0]} alt=""/><img src={images[1]} alt=""/></div>
 </section>;
}
