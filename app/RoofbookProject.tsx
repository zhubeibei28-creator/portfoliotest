'use client';
import Localized from './Localized';

import ProjectOverview from './ProjectOverview';

import { useEffect, useRef, useState } from 'react';
import ProjectSectionNav from './ProjectSectionNav';
import useProjectReveal from './useProjectReveal';

export default function RoofbookProject({onBack,onNext,nextTitle}:{onBack:()=>void;onNext?:()=>void;nextTitle?:string}) {
  const article=useRef<HTMLElement>(null);
  useProjectReveal(article);

  const video=useRef<HTMLVideoElement>(null);
  const [zoom,setZoom]=useState<{name:string;alt:string}|null>(null);
  useEffect(()=>{
    const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setZoom(null);};
    window.addEventListener('keydown',close);
    const v=video.current;
    const observer=new IntersectionObserver(([entry])=>{
      if(!v)return;
      if(entry.isIntersecting&&entry.intersectionRatio>=.2&&!document.hidden)void v.play().catch(()=>{});else v.pause();
    },{root:null,threshold:[0,.2]});
    if(v)observer.observe(v);
    return()=>{window.removeEventListener('keydown',close);observer.disconnect();v?.pause();};
  },[]);
  const photo=(name:string,alt:string,cls='')=><Localized><button className={`yan-photo ${cls}`} onClick={()=>setZoom({name,alt})} aria-label={`Enlarge: ${alt}`}><img src={`/assets/roofbook/${name}.jpg`} alt={alt} loading={name==='canal'||name==='cover'?'eager':'lazy'} decoding="async"/></button></Localized>;
  return <Localized><article className="yan-project" ref={article} aria-label="檐行记 book project">
    <header className="yan-heading">
      <div className="yan-topline"><span>SELECTED PROJECT / 05</span><button onClick={onBack}>Back to work ↗</button></div>
      <h1 lang="zh">檐行记</h1>
      <p>The Eaves of Heaven · A travelogue in two directions</p>
      <p className="yan-scroll-hint">Scroll to explore <span aria-hidden="true">↓</span></p>
    </header>
    <div className="yan-header-photo">{photo('canal','My travel photograph: rooflines framing a canal')}</div>
    <ProjectOverview year="2025" project={<>Travelogue / Editorial design<br/>Semester-long project</>} roles={['Editorial design','Typography','Photography','Paper selection','Hand binding']} description={<><p lang="zh">屋檐与天空相接之处，即是故事的开端。</p><p>Developed over a semester, 檐行记 is a travelogue exploring rooflines, climate, and shelter. Following a journey from southern China to the north, Dunhuang, and Lhasa, it connects the experience of shelter with the hands and structures that make it possible.</p></>} />
    <ProjectSectionNav root={article} items={[["yan-structure","Structure"],["yan-craft","Binding"],["yan-process","Process"],["yan-spreads","Spreads"],["yan-film","Film"]]} /><section id="yan-structure" className="yan-sequence" aria-label="Book structure">
      <div className="yan-note"><h2>One book, two entrances.</h2><p>A dos-à-dos–inspired structure brings two independent reading directions together. Turn the book to move from a vertical travelogue to a horizontal accordion: from experiencing a place to looking at how it is made.</p></div>
      <div className="yan-structure-pair"><figure>{photo('cover','檐行记: a fiber-textured cover wrapped in a cream paper band')}<figcaption>Cover / plant-fibre paper and wraparound band</figcaption></figure><figure>{photo('accordion','The architectural sequence unfolding as a horizontal accordion')}<figcaption>Accordion / continuous architectural sequence</figcaption></figure></div>
      <div className="yan-reading-pair"><div><h3>01 / The journey</h3><p>Individual pages hold bilingual travel writing, photographs, and handwritten reflections. Thinner paper gives this side a lighter, more intimate rhythm.</p></div><div><h3>02 / The making</h3><p>The accordion opens into a continuous sequence of roof forms and craftsmanship. Horizontally textured paper recalls the tactile character of xuan paper, giving this side a distinct material presence.</p></div></div>
      {photo('unfolded','The two reading orientations meeting within the hand-bound book','yan-wide')}
    </section>
    <section id="yan-craft" className="yan-craft" aria-label="Hand binding and paper">
      <div className="yan-note"><h2>Making the structure visible.</h2><p>Curves, layered edges, and repeated elements in traditional rooflines informed the book’s structure. The exposed spine keeps the hand-sewn construction visible. A butterfly-shaped stitch at its centre becomes a personal detail within the structure, extending the book’s attention to craft, connection, and the hands that build.</p></div>
      <div className="yan-reference-grid">
        <figure className="yan-roof-reference">{photo('roof-research-pair','Reference study showing two traditional roof forms')}<figcaption>Rooflines / visual research</figcaption></figure>
        <figure>{photo('spine','Exposed hand-sewn spine detail')}<figcaption>Hand sewing / exposed construction</figcaption></figure>
        <figure>{photo('paper','Horizontal paper texture')}<figcaption>Accordion paper / material reference</figcaption></figure>
        <figure>{photo('green-paper','Green plant-fibre paper reference')}<figcaption>Cover paper / material reference</figcaption></figure>
      </div>
    </section>
    <section id="yan-process" className="yan-process" aria-label="Editorial design process">
      <div className="yan-note"><h2>A quiet underlying order.</h2><p>Early pagination sketches map the pace of images, pauses, and writing across both orientations. A four-column grid and an 11 pt baseline establish structure while leaving room for handwritten Chinese notes and more expressive compositions.</p></div>
      <div className="yan-process-pair"><figure>{photo('flatplan','Early hand-drawn pagination sketches for vertical and horizontal spreads')}<figcaption>Pagination sketches / planning the reading rhythm</figcaption></figure><div className="yan-grid-study"><svg viewBox="0 0 360 480" role="img" aria-label="Four-column layout with baseline grid"><defs><pattern id="yan-baseline" width="360" height="8" patternUnits="userSpaceOnUse"><path d="M0 0H360" stroke="#deded8" strokeWidth=".5"/></pattern></defs><rect width="360" height="480" fill="white"/><rect x="28" y="28" width="304" height="424" fill="url(#yan-baseline)"/>{[28,107,186,265].map(x=><Localized key={x}><rect x={x} y="28" width="67" height="424" fill="none" stroke="#b8b4a6" strokeWidth=".7"/></Localized>)}{[134,240,346].map(y=><Localized key={y}><path d={`M28 ${y}H332`} stroke="#a9b6b2" strokeWidth=".8"/></Localized>)}</svg><p className="yan-grid-caption">Four columns · 11 pt baseline<br/>Inside margin 0.5 in · Outer margins 0.35 in</p><div className="yan-type-copy"><h3>Two typographic voices.</h3><p>Handwritten Chinese carries the intimacy of the travel notes. Serif typography supports the bilingual reading, with Sabon and Palatino appearing in the final PDF alongside Chinese text faces.</p></div></div></div>
    </section>
    <section id="yan-spreads" className="yan-pages" aria-label="Selected book spreads">
      <div className="yan-note"><h2>From structures to impressions.</h2><p>Selected pages follow the journey: the snow and stillness of Lhasa alongside a courtyard in the south. Changes in atmosphere belong to the places encountered along the way.</p></div>
      <div className="yan-spread-sequence" data-reveal-photo="true">
        <figure>{photo('snow','Lhasa: a shepherd, snow, and bilingual travel writing')}<figcaption>Lhasa / snow and travel writing</figcaption></figure>
        <figure>{photo('courtyard','Courtyard photographs and handwritten Chinese notes arranged across a spread')}<figcaption>Southern courtyard / photographs and handwritten notes</figcaption></figure>
        <figure>{photo('credits','The final image-credits spread acknowledging the referenced photographs')}<figcaption>Closing spread / image credits</figcaption></figure>
      </div>
    </section>
    <section id="yan-film" className="yan-film" aria-label="Reading the book">
      <div className="yan-note"><h2>The book in hand.</h2><div className="yan-film-caption-row">
        <p>Moving between the extended structure and individual pages.</p>
        <a href="/assets/roofbook/the-eaves-of-heaven.pdf" target="_blank" rel="noopener">View book PDF ↗</a>
      </div></div>
      <div className="yan-reading"><video ref={video} src="/assets/roofbook/reading.mp4" width={2416} height={1652} muted loop playsInline preload="metadata" aria-label="A moving view of 檐行记"/></div>
    </section>
    <footer className="yan-end"><span>檐行记 · 2025</span><button onClick={onNext??onBack}>{onNext?`Next / ${nextTitle} ↗`:'Back to work ↗'}</button></footer>
    {zoom&&<div className="yan-lightbox" role="dialog" aria-modal="true" aria-label={zoom.alt} onClick={()=>setZoom(null)}><button className="yan-close" autoFocus onClick={()=>setZoom(null)}>Close ×</button><img src={`/assets/roofbook/${zoom.name}.jpg`} alt={zoom.alt}/></div>}
  </article></Localized>;
}
