'use client';

import { useEffect, useRef, useState } from 'react';
import VisibilityVideo from './VisibilityVideo';

export default function GraftProject({ onBack }: { onBack: () => void }) {
  const indexRef = useRef<HTMLElement>(null);
  const [floatingIndex,setFloatingIndex] = useState(false);
  const [activeSection,setActiveSection] = useState('');
  useEffect(()=>{
    const root=indexRef.current?.closest('.graft-project');
    if(!root)return;
    const sections=Array.from(root.querySelectorAll<HTMLElement>('.gf-section[aria-labelledby]'));
    let frame=0;
    const update=()=>{
      frame=0;
      const bar=root.querySelector('.gf-floating-index');
      const line=root.getBoundingClientRect().top+(bar?.getBoundingClientRect().height??48)+40;
      let current='';
      for(const section of sections){
        if(section.getBoundingClientRect().top<=line)current=section.getAttribute('aria-labelledby')??'';
        else break;
      }
      setActiveSection(current);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    root.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    const resize=new ResizeObserver(schedule);
    sections.forEach(section=>resize.observe(section));
    update();
    return()=>{root.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);resize.disconnect();cancelAnimationFrame(frame);};
  },[]);

  useEffect(()=>{
    const nav=indexRef.current;
    const root=nav?.closest('.graft-project');
    if(!nav||!root)return;
    const observer=new IntersectionObserver(([entry])=>{
      setFloatingIndex(!entry.isIntersecting&&entry.boundingClientRect.bottom<=(entry.rootBounds?.top??0));
    },{root,threshold:0});
    observer.observe(nav);
    return()=>observer.disconnect();
  },[]);
  const [zoom, setZoom] = useState<{src:string;alt:string}|null>(null);
  useEffect(() => {
    const close = (e:KeyboardEvent) => { if(e.key === 'Escape') setZoom(null); };
    window.addEventListener('keydown',close);
    return () => window.removeEventListener('keydown',close);
  },[]);
  const photo = (name:string,alt:string,extra='') => <button className={`gf-image ${extra}`} onClick={()=>setZoom({src:`/assets/graft/${name}.webp`,alt})} aria-label={`Enlarge: ${alt}`}><img src={`/assets/graft/${name}.webp`} alt={alt} loading="lazy" decoding="async" /></button>;
  const heading = (id:string,n:string,title:string,copy:string) => <div className="gf-section-heading"><div><span className="gf-eyebrow">{n}</span><h2 id={id}>{id==='gf-world'?<>The station is working again.<br/><span className="gf-title-line">Just differently.</span></>:title}</h2></div><p>{copy}</p></div>;
  const collage = (page:number,main:number,reference:number,title:string,copy:string) => {
    const detail=page===43?'roots':page===45?'waterfall':'new-growth';
    return <div className="gf-editorial-collage">{photo(`collage-${page}-${main}`,title)}<div className="gf-collage-context"><figure className="gf-detail-figure"><button className="gf-image" onClick={()=>setZoom({src:`/assets/graft/closeup-${detail}.png`,alt:`${title} / in-scene close-up`})} aria-label={`Enlarge: ${title} / in-scene close-up`}><img src={`/assets/graft/closeup-${detail}.png`} alt={`${title} / in-scene close-up`} loading="lazy"/></button><figcaption className="gf-caption">In-scene close-up</figcaption></figure><div className="gf-collage-copy"><h3>{title}</h3><p>{copy}</p></div></div></div>;
  };
  return <article className="graft-project">
    <header className="gf-heading"><div className="gf-topline"><span>SELECTED PROJECT / 04</span><button onClick={onBack}>Back to work ↗</button></div><h1>GRÆFT</h1><div className="gf-heading-bottom"><p>After the flood.<br/>New growth.</p><span>Music Festival Identity &amp; Experience</span></div></header>
    <div className="gf-hero"><img src="/assets/graft/hero.webp" alt="GRÆFT’s underground station environment" fetchPriority="high" /></div>
    <section className="gf-overview"><div><h2 className="gf-eyebrow">OVERVIEW</h2><p>A fictional music festival set inside an abandoned underground station. After a flood interrupts the routines of commuting and work, water and vegetation begin to reclaim the infrastructure. The station comes back to life after dark, through sound, light and collective experience.</p></div><div className="gf-metadata gf-credits"><div><h2 className="gf-eyebrow">YEAR</h2><p>2026</p></div><div><h2 className="gf-eyebrow">PROJECT</h2><p>Collaborative Project</p></div><div><h2 className="gf-eyebrow">MY ROLE</h2><ul className="gf-role-list"><li className="gf-role-lead">Lead Concept Development &amp; Art Direction</li><li>Visual Identity</li><li>Spatial &amp; Experiential Design</li><li>Motion, Promotion &amp; Merchandise</li></ul></div></div></section>
    <nav ref={indexRef} className="gf-index" aria-label="GRÆFT project sections"><a href="#gf-research" aria-current={activeSection==='gf-research'?'location':undefined}>01 Research</a><a href="#gf-identity" aria-current={activeSection==='gf-identity'?'location':undefined}>02 Identity</a><a href="#gf-world" aria-current={activeSection==='gf-world'?'location':undefined}>03 World-building</a><a href="#gf-space" aria-current={activeSection==='gf-space'?'location':undefined}>04 Spatial experience</a><a href="#gf-activation" aria-current={activeSection==='gf-activation'?'location':undefined}>05 Activation</a><a href="#gf-promotion" aria-current={activeSection==='gf-promotion'?'location':undefined}>06 Promotion</a><a href="#gf-objects" aria-current={activeSection==='gf-objects'?'location':undefined}>07 Objects</a></nav>
    {floatingIndex&&<nav className="gf-index gf-floating-index" aria-label="Floating GRÆFT project sections"><a href="#gf-research" aria-current={activeSection==='gf-research'?'location':undefined}>01 Research</a><a href="#gf-identity" aria-current={activeSection==='gf-identity'?'location':undefined}>02 Identity</a><a href="#gf-world" aria-current={activeSection==='gf-world'?'location':undefined}>03 World-building</a><a href="#gf-space" aria-current={activeSection==='gf-space'?'location':undefined}>04 Spatial experience</a><a href="#gf-activation" aria-current={activeSection==='gf-activation'?'location':undefined}>05 Activation</a><a href="#gf-promotion" aria-current={activeSection==='gf-promotion'?'location':undefined}>06 Promotion</a><a href="#gf-objects" aria-current={activeSection==='gf-objects'?'location':undefined}>07 Objects</a></nav>}

    <section className="gf-section" aria-labelledby="gf-research">
      {heading('gf-research','01 / RESEARCH','From sound to a visual world.','Our research followed Jungle from its early breakbeat roots to its contemporary revival. Rather than reproducing one fixed aesthetic, we explored how rhythm, underground culture and visual experimentation could inform a new festival identity.')}
      <div className="gf-research-principles"><div><span>01</span><h3>Rhythm & fragmentation</h3><p>Chopped rhythms became a starting point for fragmented surfaces, disrupted imagery and a sense of movement.</p></div><div><span>02</span><h3>Underground culture</h3><p>The station connects the festival to transit, nightlife and the transformation of everyday public space.</p></div><div><span>03</span><h3>Roots & new growth</h3><p>Early and contemporary Jungle informed two distinct levels, connected by a physical and sonic transition.</p></div></div>
      <div className="gf-research-images">{photo('research-rave-1','Research reference: early Jungle and rave culture')}{photo('research-rave-2','Research reference: underground music and collective experience')}</div><p className="gf-caption">Found reference imagery from the project research / not original GRÆFT artwork.</p>
      <div className="gf-subheading"><h3>Visual research</h3><p>Fluid lines, metallic textures, digital noise and organic growth informed the visual direction.</p></div>
      <div className="gf-reference-strip">{[1,2,3,4,5].map(n=><div key={n}>{photo(`reference-${n}`,`Visual inspiration reference ${n}: texture, distortion and organic form`)}</div>)}</div><p className="gf-caption">Inspiration / reference imagery.</p>
    </section>

    <section className="gf-section" aria-labelledby="gf-identity">
      {heading('gf-identity','02 / VISUAL IDENTITY','Joining. Growing. Merging.','GRAFT refers to joining and growing together. The ligature Æ brings two letters into one form; the identity connects synthetic surfaces with the possibility of organic growth.')}
      <div className="gf-logo-pair">{photo('logo-display','GRÆFT wordmark','gf-inverted-logo')}{photo('chrome-logo-display','GRÆFT chrome wordmark','gf-inverted-logo')}</div>
      <figure className="gf-logo-motion"><VisibilityVideo src="/assets/graft/logo-animation.mp4" poster="/assets/graft/logo-animation-poster.webp" label="GRÆFT melting and glitching logo animation" /><figcaption className="gf-caption">Logo animation / melt & glitch. Sound available through the player controls.</figcaption></figure>
      <div className="gf-system"><div><span className="gf-eyebrow">TYPOGRAPHY</span><img className="gf-type-specimen" src="/assets/graft/type-specimen-complete.webp" alt="SD Gothic Neo Semibold alphabet and No Return Service typography specimen" loading="lazy" /><p>SD Gothic Neo / Semibold<br/>A direct typographic voice supports the softer, fluid wordmark.</p></div><div><span className="gf-eyebrow">COLOR & MATERIAL</span><div className="gf-colors">{[['#88ED4D','Acid green'],['#7F3AEF','Violet'],['#202226','Charcoal']].map(([hex,label])=><div key={hex} style={{background:hex,color:hex==='#202226'?'#ddd':'#10110f'}}><span>{label}</span><span>{hex}</span></div>)}</div><p>Translucent chrome adds a reflective material layer.</p></div></div>
    </section>

    <section className="gf-section" aria-labelledby="gf-world">
      {heading('gf-world','03 / WORLD-BUILDING','The station is working again. Just differently.','A flood forces commuters to leave their possessions behind. Without daily use or maintenance, moisture reshapes the station. Office objects become traces of its former life, while moss, water and vegetation establish a new one.')}
      <div className="gf-story"><div><span className="gf-eyebrow">BEFORE</span><h3>Routine</h3><p>Transit, work and the objects of daily productivity.</p></div><div><span className="gf-eyebrow">INTERRUPTION</span><h3>The flood</h3><p>Navigation fails. The station is left behind.</p></div><div><span className="gf-eyebrow">AFTER HOURS</span><h3>Reclamation</h3><p>Sound, water and new growth return life to the ruin.</p></div></div>
      <div className="gf-pair gf-research-pair">{photo('abandoned-1','World-building research: objects and traces of former routines')}{photo('regrowth-1','World-building research: vegetation reclaiming built space')}</div><p className="gf-caption">World-building references / found imagery, not proposed festival spaces.</p>
      <div className="gf-subheading"><h3>A fictional London underground</h3><p>Canary Wharf’s curved entrances, commuting culture and waterfront context informed the setting. The venue combines these references with newly designed spaces rather than recreating a specific station.</p></div>
      <div className="gf-pair gf-research-pair">{photo('venue-reference-1','Architectural inspiration: Canary Wharf transit environment')}{photo('venue-reference-2','Architectural inspiration: London Docklands context')}</div><p className="gf-caption">Venue inspiration / reference photography.</p>
    </section>

    <section className="gf-section" aria-labelledby="gf-space">
      {heading('gf-space','04 / SPATIAL EXPERIENCE','Two floors. Two eras.','ROOTS explores the darker, raw beginnings of Jungle. NEW GROWTH opens into a more fluid, immersive environment. An elevator becomes the transition between these two worlds.')}
      <nav className="gf-space-preview" aria-label="Explore the spatial experience">
        <div className="gf-preview-label"><span className="gf-eyebrow">SPACE AT A GLANCE</span><p>Select a moment to explore.</p></div>
        <div className="gf-preview-grid">{[
          ['arrival','Arrival','arrival'],
          ['underground','From street to underground','tile-logo-wall'],
          ['roots','ROOTS','roots-panorama'],
          ['transfer','Elevator','elevator-poster'],
          ['growth','NEW GROWTH','growth-panorama'],
          ['stairs','Stairs / Exit','exit-original'],
        ].map(([id,title,image],i)=><a key={id} href={`#gf-space-${id}`}><div className={`gf-preview-image gf-preview-${id}`}><img src={`/assets/graft/${image}.webp`} alt="" loading="lazy"/></div><span><small>0{i+1}</small>{title}<b aria-hidden="true">↗</b></span></a>)}</div>
      </nav>

      <div className="gf-subheading"><h3>Venue plan</h3><p>Platforms become dance spaces, the train becomes a DJ setting, and pools and seating connect the event to the memory of the flood.</p></div>
      <button className="gf-image gf-wide-plan" onClick={()=>setZoom({src:'/assets/graft/section-plan-updated.png',alt:'GRÆFT architectural section and spatial arrangement'})} aria-label="Enlarge: GRÆFT architectural section and spatial arrangement"><img src="/assets/graft/section-plan-updated.png" alt="GRÆFT architectural section and spatial arrangement" loading="lazy" decoding="async"/></button>
      <div className="gf-pair gf-floor-plans"><figure><img src="/assets/graft/floor-roots.svg" alt="ROOTS floor plan with labeled pools, stage, seating, stairs and elevator"/><figcaption className="gf-caption">ROOTS / Lower level</figcaption></figure><figure><img src="/assets/graft/floor-new-growth.svg" alt="NEW GROWTH floor plan with labeled stage, pool, seating, stairs and elevator"/><figcaption className="gf-caption">NEW GROWTH / Upper level</figcaption></figure></div>
      <nav className="gf-visitor-journey" aria-label="Visitor journey"><div className="gf-preview-label"><span className="gf-eyebrow">VISITOR JOURNEY</span><p>A route through the two levels.</p></div><ol>{[
        ['arrival','Arrive','Street entrance & concourse'],
        ['roots','ROOTS','Lower level / early Jungle'],
        ['transfer','Transfer','Elevator / a shift in sound'],
        ['growth','NEW GROWTH','Upper level / contemporary Jungle'],
        ['stairs','Exit','Stairs / return to the city'],
      ].map(([id,title,copy],i)=><li key={id}><a href={`#gf-space-${id}`}><span className="gf-route-number">0{i+1}</span><h3>{title}</h3><p>{copy}</p></a></li>)}</ol></nav>
      <div className="gf-subheading"><h3 id="gf-space-arrival">Arrival & descent</h3><p>Familiar station architecture gradually gives way to fragmented tiles, botanical growth and the festival identity.</p></div>
      <div className="gf-arrival-pair">{photo('arrival','Concept visualization: arrival at the underground canopy')}
      <figure className="gf-entry-motion"><VisibilityVideo src="/assets/graft/entry-promo.mp4" poster="/assets/graft/entry-poster.webp" label="GRÆFT promotional video displayed at the entrance" controls={false} /><figcaption className="gf-caption">Entry / promotional screen in context.</figcaption></figure></div>
      <div className="gf-subheading"><h3 id="gf-space-underground">From street to underground</h3><p>The street entrance leads into a green-lit interior and onward to the concourse. Tiled surfaces and the first traces of vegetation gradually introduce the festival world.</p></div>
      <div className="gf-pair">{photo('entrance-scale','Entrance interior / neon figures establish human scale')}{photo('entrance-door-scale','Entrance doors / neon figures establish human scale')}</div>
      {photo('concourse','Arrival concourse / gates, botanical growth and neon scale figure','gf-collage')}
      <div className="gf-subheading"><h3>Pause at the entrance</h3><p>A vending machine and Photo Booth create moments to stop and interact before entering the main venue. These small encounters extend the identity into the visitor’s journey through the station.</p></div>
      <div className="gf-entry-interactions"><figure>{photo('entrance-vending','Entrance experience / vending machine in context')}<figcaption className="gf-caption">Vending machine / Entrance interaction</figcaption></figure><figure>{photo('entrance-photobooth','Entrance experience / Photo Booth in context')}<figcaption className="gf-caption">Photo Booth / Entrance interaction</figcaption></figure></div>
      {photo('tile-approach-scale','Approaching the tile logo wall / neon figure for scale','gf-collage')}
      <div className="gf-subheading"><h3 id="gf-space-tile">Botanical tile logo</h3><p>Missing tiles reveal botanical growth beneath the station’s surface. The metallic wordmark becomes part of the architecture, connecting the identity to the story of reclamation.</p></div>
      {photo('tile-logo-wall','GRÆFT botanical tile logo wall collage','gf-collage')}
      <div className="gf-subheading"><h3>Switchback stairs</h3><p>Two switchback staircases flank the botanical tile logo wall, corresponding to the stair routes shown in the venue plans and architectural section. Tiled walls, metal railings and suspended screens carry the station’s visual language through these circulation spaces.</p></div>
      <div className="gf-switchback-pair">{photo('stair-descent-1','Switchback staircase beside the tile logo wall / suspended screens')}{photo('stair-descent-2','Switchback staircase beside the tile logo wall / central stairwell')}</div>
      <div className="gf-subheading"><h3 id="gf-space-roots">ROOTS / The underground</h3><p>Industrial structures remain exposed. Water and suspended light echo the flood, while the first signs of vegetation gather around the stage.</p></div>
      {photo('roots-pdf-42','ROOTS / main environment with neon figures for scale','gf-collage')}
      {collage(43,0,1,'ROOTS / Stage collage','The stage design combines exposed industrial metal with the first signs of regrowth. Suspended rings and fluid light tubes echo the movement of water; vegetation gathers around the DJ booth while most of the framework remains exposed.')}
      <figure className="gf-roots-motion"><VisibilityVideo src="/assets/graft/roots-motion.mp4" poster="/assets/graft/roots-motion-poster.webp" label="ROOTS stage motion with original audio" preferSound /><figcaption className="gf-caption">ROOTS / Stage motion with original audio</figcaption></figure>
      {collage(45,1,0,'ROOTS / Waterfall installation','The waterfall installation sits within the ROOTS environment. Water spills from staggered metal channels, recalling the burst pipes that flooded the station. A trace of the destruction becomes an installation within ROOTS.')}
      <div className="gf-subheading"><h3 id="gf-space-transfer">ROOTS → NEW GROWTH</h3><p>The elevator is a transition between the two festival worlds. The moving sequence reveals the shift from the underground roots into new growth.</p></div>
      <figure className="gf-elevator-video"><VisibilityVideo src="/assets/graft/elevator-transition.mp4" poster="/assets/graft/elevator-poster.webp" label="Elevator transition from ROOTS to NEW GROWTH" controls={false} /><figcaption className="gf-caption">Elevator transition / moving spatial concept</figcaption></figure>
      <div className="gf-subheading"><h3 id="gf-space-growth">NEW GROWTH / The upper level</h3><p>Vegetation overtakes the metal framework. Light, water and projections turn the upper level into a more immersive environment.</p></div>
      {photo('new-growth','NEW GROWTH / main environment with neon figures for scale','gf-full')}
      {collage(48,0,1,'NEW GROWTH / Stage collage','The stage retains a similar structure to ROOTS, but is more heavily overtaken by vegetation. Moss and climbing vines spread across the metal framework, while the hanging lights become integrated with the surrounding greenery.')}
      <div className="gf-subheading"><h3 id="gf-space-chambers">Specimen chambers</h3><p>Office-worker figures become remnants of the station’s former life, held within glass chambers and gradually overtaken by water and vegetation.</p></div>
      <div className="gf-chamber-composition">{photo('collage-50-0','Specimen chamber / office worker')}<div><button className="gf-image" onClick={()=>setZoom({src:'/assets/graft/chambers-closeup.png',alt:'Specimen chambers / in-scene close-up of the two figures'})} aria-label="Enlarge: Specimen chambers / two figures in context"><img src="/assets/graft/chambers-closeup.png" alt="Specimen chambers / two figures in context" loading="lazy"/></button><div className="gf-collage-copy"><h3>NEW GROWTH / Specimen chambers</h3><p>Faceless office workers and transit staff are held inside glass chambers. Partially submerged and overtaken by vegetation, they become remnants of the station’s everyday life.</p></div></div>{photo('collage-50-1','Specimen chamber / transit staff')}</div>
      <div id="gf-space-stairs" className="gf-stairs-exit">{photo('exit-original','Stairs / overgrown departure route','gf-collage')}<p className="gf-caption">Stairs / Return to the city</p></div>
      <p className="gf-caption">Spatial concepts shown through digital collage and AI-assisted visualization. These are proposed environments for a fictional festival.</p>
    </section>

    <section className="gf-section" aria-labelledby="gf-activation">
      {heading('gf-activation','05 / BRAND ACTIVATION','Partners inside the world.','Proposed brand collaborations become part of the station’s story, from reflective surfaces and wearable objects to a repurposed service window. These are speculative concepts, not commissioned partnerships.')}
      <div className="gf-activation-group"><div className="gf-subheading gf-brand-intro"><h3 className="gf-brand-heading"><img src="/assets/graft/danessa-lockup-tight.png" alt="GRÆFT × Danessa Myricks Beauty"/></h3><p>A proposed beauty collaboration translates the shimmer of glitter eyeshadow into a movement-responsive installation and a set of festival cosmetics.</p></div>
      <div className="gf-brand-scenes">{photo('danessa-context','Danessa Myricks Beauty / activation in the festival environment')}{photo('danessa-installation','Danessa Myricks Beauty / installation design')}</div>
      {photo('composition-55','Danessa Myricks Beauty / shimmer wall spatial visualization','gf-full')}
      <div className="gf-subheading"><h3>Kinetic shimmer wall</h3><p>Reflective tiles respond to participants’ movements and recreate their poses, extending the collaborating brand’s metallic glitter into a shared spatial experience.</p></div>
      {photo('composition-57','GRÆFT × Danessa Myricks Beauty / complete cosmetic packaging and product designs','gf-full')}</div>
      <div className="gf-activation-group"><div className="gf-subheading gf-brand-intro"><h3 className="gf-brand-heading"><img src="/assets/graft/liquid-lockup-tight.png" alt="GRÆFT × Liquid Death"/></h3><p>An abandoned subway service window becomes a drink redemption point. The skeleton installation connects Liquid Death’s identity with GRÆFT’s story of decay and regrowth.</p></div>
      <div className="gf-brand-scenes">{photo('liquid-context','Liquid Death / activation in the festival environment','gf-liquid-context')}{photo('liquid-installation','Liquid Death / installation design')}</div>
      <div className="gf-editorial-collage gf-service-window">{photo('service-window-updated','GRÆFT × Liquid Death service window with redemption signage and skeleton installation')}<div className="gf-collage-context gf-service-context">{photo('service-window-sign','GRÆFT × Liquid Death metal sign: Redeem / Purchase Here')}<div className="gf-collage-copy"><h3>Service window / Redemption point</h3><p>Visitors can claim a limited number of free drinks or purchase their own. The skeleton echoes the office-worker displays elsewhere in the station, connecting Liquid Death’s identity with GRÆFT’s story of decay and regrowth.</p></div></div></div>
      {photo('composition-63','Liquid Death / GRÆFT can design and original versus adapted brand graphics','gf-full')}</div>
      <p className="gf-caption">Speculative brand activation concepts / selected visuals use AI-assisted rendering.</p>
    </section>

    <section className="gf-section" aria-labelledby="gf-promotion">
      {heading('gf-promotion','06 / PROMOTION','The station reaches the city.','Transit advertising brings the identity back into the spaces of daily commuting. The same green, violet and distorted visual language connects transit placements and promotional objects.')}
      <div className="gf-subheading"><h3>Your shift ends here.</h3><p>A conceptual promotional banner introduces GRÆFT through its fictional world. A familiar commute is interrupted by fragmented surfaces and botanical growth, inviting the viewer to leave the working day behind and enter the festival.</p></div>
      <button className="gf-image gf-concept-banner" onClick={()=>setZoom({src:'/assets/graft/concept-promotion-banner.png',alt:'Your shift ends here / complete GRÆFT conceptual promotional banner'})} aria-label="Enlarge: Complete GRÆFT conceptual promotional banner"><img src="/assets/graft/concept-promotion-banner.png" alt="Your shift ends here / complete GRÆFT conceptual promotional banner" loading="lazy" decoding="async"/></button>
      <p className="gf-caption">Conceptual promotion / Complete banner artwork</p>
      <div className="gf-pair">{photo('billboard','GRÆFT subway billboard mockup')}{photo('train-ad','GRÆFT interior train advertising mockup')}</div>
      <div className="gf-subheading" id="gf-social"><h3>Social media promotion</h3><p>A concept Instagram presence introduces the festival through a profile, story highlights, and teaser posts—bringing GRÆFT’s underground world into the everyday feed.</p></div>
      <div className="gf-social-pair" aria-label="GRÆFT social media concept"><figure className="gf-social-phone gf-social-profile"><img src="/assets/graft/social-promotion.webp" alt="GRÆFT Instagram profile concept with festival highlights and campaign posts" loading="lazy" /></figure><figure className="gf-social-phone gf-social-post"><img src="/assets/graft/social-promotion.webp" alt="GRÆFT Instagram teaser post concept" loading="lazy" /></figure></div>
      <div className="gf-subheading"><h3>Digital experience</h3><p>The festival website extends GRÆFT’s underground world into a digital experience through metallic surfaces, acid-green typography and motion.</p></div>
      <figure className="gf-website-experience"><VisibilityVideo src="/assets/graft/website-experience.mp4" poster="/assets/graft/website-experience-poster.jpg" label="GRÆFT festival website walkthrough" controls={false} /></figure>
    </section>

    <section className="gf-section" aria-labelledby="gf-objects">
      {heading('gf-objects','07 / COLLATERAL & MERCHANDISE','Objects from another routine.','Admission bands, access passes and wearable objects turn the world-building into things visitors can carry. Office-like identification becomes a ticket into a different kind of after-hours experience.')}
      <div className="gf-object-group"><div className="gf-subheading"><h3>01 / Ticket system</h3><p>Two admission formats distinguish general access from VIP entry. Wristbands and office-style passes carry the festival identity into the visitor experience.</p></div>
      <h4 className="gf-object-label">General admission / Wristbands</h4><figure className="gf-vip-design">{photo('general-admission-design-only','General admission / both wristband designs','gf-ticket-art')}<figcaption>GENERAL ADMISSION</figcaption></figure>
      <h4 className="gf-object-label">VIP / Lanyard & access pass</h4><figure className="gf-vip-design">{photo('vip-design-only','VIP / lanyard and front and back access pass designs','gf-ticket-art')}<figcaption>VIP TICKET</figcaption></figure>
      {photo('badge','Ticket system / physical access-pass mockups','gf-full')}</div>
      <div className="gf-object-group"><div className="gf-subheading"><h3>02 / Interactive touchpoints</h3><p>Station fixtures become moments of exchange: merchandise to take into the festival, and photographs to take home.</p></div>
      <div className="gf-touchpoints"><section><h4>Merchandise vending machine</h4><div className="gf-touchpoint-main"><VisibilityVideo src="/assets/graft/vending-machine-motion.mp4" poster="/assets/graft/vending-machine-poster.jpg" label="GRÆFT merchandise vending machine mockup" /></div><div className="gf-touchpoint-detail">{photo('entrance-vending','Vending machine / in-scene close-up')}<p>A familiar station fixture dispenses GRÆFT merchandise before visitors enter the main venue.</p></div></section>
      <section><h4>Photo Booth</h4><div className="gf-touchpoint-main">{photo('photobooth-display','Photo Booth / booth design and complete printed photo-strip designs')}</div><div className="gf-touchpoint-detail">{photo('entrance-photobooth','Photo Booth / in-scene close-up')}<p>The booth and its printed photographs extend the identity into a personal keepsake.</p></div></section></div></div>
      <div className="gf-subheading"><h3>03 / Merchandise</h3><p>Wearable objects and accessories carry the visual identity beyond the venue.</p></div>
      <div className="gf-merch-grid">{photo('shirt-1','GRÆFT shirt mockup')}{photo('shirt-2','GRÆFT second shirt mockup')}</div>
      <div className="gf-merch-grid gf-merch-three">{photo('vest-1','GRÆFT life vest front mockup')}{photo('vest-2','GRÆFT life vest side mockup')}<div>{photo('vest-3','GRÆFT life vest back mockup')}<div className="gf-vest-copy"><p>A life vest reimagined as rave wear, connecting the flooded-station narrative with utility straps and acid-green details.</p></div></div></div>
      <div className="gf-merch-grid">{photo('keychain-1','GRÆFT keychain mockup')}{photo('keychain-2','GRÆFT keychain second mockup')}</div>
      {photo('tie','GRÆFT tie merchandise concept','gf-full')}
      <p className="gf-caption">Group project outputs / selected merchandise mockups use AI-assisted rendering.</p>
    </section>
    <div className="gf-showcased-credit gf-final-credits"><div><h2 className="gf-eyebrow">INDEPENDENT CONTRIBUTIONS</h2><ul className="gf-role-list"><li>Logo &amp; Wordmark Design</li><li>Spatial Design &amp; Visualization</li><li>Environmental Collages</li><li>Promotional Video</li></ul></div><div><h2 className="gf-eyebrow">COLLABORATIVE CONTRIBUTIONS</h2><ul className="gf-role-list"><li>Promotional Campaign</li><li>Merchandise Design</li><li>Floor Plan Development</li></ul></div><div><h2 className="gf-eyebrow">SHOWCASED WORK</h2><p>Individual &amp; Collaborative Work<br/>with Yelin Kim</p></div></div>
    <footer className="gf-end"><span>GRÆFT / No Return Service.</span><button onClick={onBack}>Back to selected work ↗</button></footer>
    {zoom&&<div className="gf-lightbox" role="dialog" aria-modal="true" aria-label={zoom.alt} onClick={()=>setZoom(null)}><button autoFocus onClick={()=>setZoom(null)}>Close ×</button><img src={zoom.src} alt={zoom.alt}/></div>}
  </article>;
}
