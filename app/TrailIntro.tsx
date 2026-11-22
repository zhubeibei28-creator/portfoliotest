'use client';
import {useEffect,useRef,useState} from 'react';
import './trail-intro.css';

const art=[
 {src:'/assets/lab/food-on-record/cover-1.webp',id:null},
 {src:'/assets/lab/ambers-pulses/cover.webp',id:null},
 {src:'/assets/shuxia/courtyard-poster.webp',id:null},
 {src:'/assets/graft/tile-logo-wall.webp',id:null},
 {src:'/assets/lab/self-checkout/cover.webp',id:null},
 {src:'/assets/icepact-poster.webp',id:'04'},
 {src:'/assets/roofbook-cover-two-spreads-v7.png',id:'05'},
 {src:'/assets/pocklet-cover.png',id:'03'},
 {src:'/assets/graeft-subway-cover-v1.png',id:'02'},
 {src:'/assets/shuxia/home-postcards-cover.webp',id:'01'},
];
const small=[[349,201,87,101],[375,208,87,101],[396,231,87,101],[418,257,87,101],[440,231,87,101],[460,208,87,101],[478,184,87,101],[500,208,87,101],[515,218,87,101],[520,232,87,101]];
const large=[[492,167,227,262],[456,157,227,262],[426,123,227,262],[397,89,227,262],[367,123,227,262],[337,157,227,262],[308,191,227,262],[279,157,227,262],[258,123,227,262],[237,108,252,291]];
export default function TrailIntro({onOriginal}:{onOriginal:()=>void}){
 const root=useRef<HTMLElement>(null),cards=useRef<(HTMLDivElement|null)[]>([]);
 const touch=useRef<number|null>(null),exited=useRef(false),exit=useRef(onOriginal);exit.current=onOriginal;
 const [leaving,setLeaving]=useState(false);
 const [started,setStarted]=useState(false);
 const finishRef=useRef<()=>void>(()=>{});
 useEffect(()=>{
  const node=root.current;if(!node)return;let disposed=false,booted=false,lastWidth=0,lastHeight=0,generation=0;let autoTimer:number|undefined;const animations:Animation[]=[];
  const run=(animate=true)=>{
   if(disposed||exited.current)return;const current=++generation;window.clearTimeout(autoTimer);setStarted(true);animations.splice(0).forEach(a=>a.cancel());const w=window.innerWidth,h=window.innerHeight,cw=Math.min(w,h*1920/934,1180)*.92,ch=cw*934/1920,ox=(w-cw)/2,oy=(h-ch)/2-h*.04;
   lastWidth=w;lastHeight=h;
   const transform=(r:number[])=>`translate(${ox+r[0]/960*cw}px,${oy+r[1]/540*ch}px) scale(${r[2]/960*cw/300},${r[3]/540*ch/300})`;
   cards.current.forEach((card,i)=>{if(!card)return;card.style.transform=transform(large[i]);card.style.opacity='1';
    const poster=art[i].src.includes('self-checkout')?card.querySelector('img'):null;
    if(poster){card.style.background='#fff';poster.style.objectFit='contain';poster.style.transform=`scaleX(${large[i][3]/large[i][2]})`;}
    if(!animate||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    const end=large[i],begin=[end[0]+end[2]*.08,end[1]+end[3]*.08,end[2]*.84,end[3]*.84];
    const delay=.12+i*.185,assemblyEnd=3.34,expandEnd=4.90,total=5.2;
    const frames=[
     {offset:0,opacity:0,transform:transform(begin)},
     {offset:delay/total,opacity:0,transform:transform(begin),easing:'cubic-bezier(.16,1,.3,1)'},
     {offset:(delay+.15)/total,opacity:1,transform:transform(end)},
     {offset:(delay+.27)/total,opacity:1,transform:transform(end),easing:'cubic-bezier(.4,0,.2,1)'},
     {offset:(delay+1.05)/total,opacity:1,transform:transform(small[i])},
     {offset:assemblyEnd/total,opacity:1,transform:transform(small[i]),easing:'cubic-bezier(.4,0,.2,1)'},
     {offset:expandEnd/total,opacity:1,transform:transform(end)},
     {offset:1,opacity:1,transform:transform(end)}
    ];
    animations.push(card.animate(frames,{duration:total*1000/1.04,easing:'linear',fill:'both'}));
    if(poster){const rectangles=[begin,begin,end,end,small[i],small[i],end,end];animations.push(poster.animate(frames.map((frame,n)=>({offset:frame.offset,easing:frame.easing,transform:`scaleX(${rectangles[n][3]/rectangles[n][2]})`})),{duration:total*1000/1.04,easing:'linear',fill:'both'}));}
   });
   void Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{if(disposed||exited.current||current!==generation)return;autoTimer=window.setTimeout(()=>finishRef.current(),650);});
  };
  const observer=new ResizeObserver(()=>{if(booted&&(Math.abs(window.innerWidth-lastWidth)>2||Math.abs(window.innerHeight-lastHeight)>2))run(false);});observer.observe(node);
  Promise.all(cards.current.map(card=>card?.querySelector('img')?.decode().catch(()=>{}))).then(()=>{run();booted=true;});
  return()=>{disposed=true;window.clearTimeout(autoTimer);observer.disconnect();animations.forEach(a=>a.cancel());};
 },[]);
 const finish=()=>{
  if(exited.current)return;exited.current=true;
  const targets=Array.from(document.querySelectorAll<HTMLElement>('.gallery-project')).slice(5,10);
  const duration=1650/1.04/1.04;
  const transfers:Animation[]=[];
  cards.current.forEach((card,i)=>{if(!card)return;const a=card.getBoundingClientRect();card.getAnimations().forEach(animation=>animation.cancel());
   Object.assign(card.style,{width:`${a.width}px`,height:`${a.height}px`,transform:`translate(${a.left}px,${a.top}px)`});
   const target=targets.find(el=>el.querySelector('.gallery-index')?.textContent?.trim()===art[i].id);
   if(!target){card.animate([{opacity:1},{opacity:0}],{duration:650,fill:'forwards'});return;}
   const b=target.getBoundingClientRect();
   transfers.push(card.animate([{transform:`translate(${a.left}px,${a.top}px) scale(1)`},{transform:`translate(${b.left}px,${b.top}px) scale(${b.width/a.width},${b.height/a.height})`}],{duration,easing:'cubic-bezier(.32,0,.16,1)',fill:'forwards'}));
   card.animate([{opacity:1,offset:0},{opacity:1,offset:.82},{opacity:0,offset:1}],{duration,easing:'linear',fill:'forwards'});
  });
  setLeaving(true);void Promise.all(transfers.map(animation=>animation.finished.catch(()=>{}))).then(()=>exit.current());
 };
 finishRef.current=finish;
 useEffect(()=>{const node=root.current;if(!node)return;const wheel=(e:WheelEvent)=>{if(e.ctrlKey)return;e.preventDefault();if(Math.abs(e.deltaY)>15)finish();};node.addEventListener('wheel',wheel,{passive:false});return()=>node.removeEventListener('wheel',wheel);},[]);
 return <section ref={root} className={`trail-intro pure-intro personal-opening cover-opening${leaving?' is-entering-home':''}`} data-started={started} onClick={finish} onTouchStart={e=>touch.current=e.touches[0].clientY} onTouchEnd={e=>{if(touch.current!==null&&touch.current-e.changedTouches[0].clientY>35)finish();}}>
  <div className="cover-stack" aria-label="Selected project covers">{art.map((a,i)=><div key={a.src} ref={el=>{cards.current[i]=el;}} className="cover-stack-card" style={{zIndex:i+1}}><img src={a.src} alt="" draggable={false} style={a.id==='05'?{objectPosition:'50% 54%'}:undefined}/></div>)}</div>
  <div className="bottom-opening-name" aria-label="BEIBEI ZHU">{Array.from('BEIBEI ZHU').map((c,i)=><span key={i} style={{'--i':i} as React.CSSProperties}>{c===' '?'\u00a0':c}</span>)}</div>
 </section>;
}
