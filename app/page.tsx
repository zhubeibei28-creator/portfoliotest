'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: '01',
    title: 'ICEPACT',
    type: 'Identity / Art Direction',
    year: '2026',
    crop: '0% 0%',
    text: 'A modular identity built from soft systems, hard edges, and fluorescent matter.',
    brief:
      'Create a living identity for a cultural platform that moves between publishing, exhibitions and sound.',
    idea: 'We treated softness as a system rather than a style—folding a small family of forms into an identity that can expand, contract and respond.',
  },
  {
    id: '02',
    title: '述夏SHUXIA',
    type: 'Campaign / 3D',
    year: '2025',
    crop: '100% 0%',
    text: 'A campaign where chrome forms behave like an alphabet from another orbit.',
    brief:
      'Build a launch world for a digital product without relying on familiar interface imagery.',
    idea: 'A library of reflective orbital objects became the campaign language, shifting scale and composition across every touchpoint.',
  },
  {
    id: '03',
    title: 'POCKLET',
    type: 'Editorial / Print',
    year: '2025',
    crop: '0% 100%',
    text: 'An editorial system about fragments, repetition, and the pleasure of misregistration.',
    brief:
      'Design a publication that makes research feel physical, urgent and open-ended.',
    idea: 'Documents, photographs and annotations were assembled through one strict grid, then deliberately pushed out of registration.',
  },
  {
    id: '04',
    title: "Amber's Pulses",
    type: 'Digital / Image-making',
    year: '2024',
    crop: '100% 100%',
    text: 'A series of strange, friendly objects made for screens, spaces, and small encounters.',
    brief:
      'Create a flexible image world for a programme about care, technology and the near future.',
    idea: 'Familiar expressions were embedded in unfamiliar forms, making each object feel both synthetic and oddly intimate.',
  },
];

const experiments = [
  ['01', 'Reverie Brand Animation', '', 0],
  ['02', 'Reverie Brand Image Model', '', 1],
  ['03', '要！Connect Poster', '', 2],
  ['04', 'Paper In Pattern', '', 3],
  ['05', 'Windows of Perception', '', 4],
  ['06', 'Make Her Visible', '', 5],
  ['07', 'Objects on Display', '', 6],
  ['08', 'The Making of “Her”', '', 7],
  ['09', '磁带食记 Food on Record', '', 8],
  ['10', 'Amber’s Pulses Zine', '', 9],
  ['11', 'The Orbit', '', 10],
  ['12', 'Lantern Recall', '', 11],
] as const;

type View = 'home' | 'lab' | 'about' | 'contact';

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const cursor = useRef({x:0,y:0});
  const cursorLabel = useRef<HTMLDivElement>(null);
  const cursorFrame = useRef<number | null>(null);
  const moveCursor = (e: React.PointerEvent) => {
    cursor.current = {x:e.clientX,y:e.clientY};
    if(cursorFrame.current !== null) return;
    cursorFrame.current = requestAnimationFrame(()=>{
      cursorFrame.current = null;
      if(cursorLabel.current) cursorLabel.current.style.transform = `translate3d(${cursor.current.x+18}px,${cursor.current.y+18}px,0)`;
    });
  };
  useEffect(()=>()=>{if(cursorFrame.current !== null)cancelAnimationFrame(cursorFrame.current);},[]);
  const gallery = useRef<HTMLDivElement>(null);
  const galleryRow = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);
  const position = useRef(0);
  const velocity = useRef(0);
  const hoverPaused = useRef(false);

  useEffect(() => {
    if (view !== 'home' || active !== null) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const row = galleryRow.current;
      if (row) {
        const segment = row.scrollWidth / 3;
        const dt = Math.min(32, now - previous);
        previous = now;
        if (!position.current && segment) position.current = segment;
        velocity.current *= Math.pow(0.9, dt / 16.67);
        position.current += velocity.current;
        if (!hoverPaused.current) position.current += 0.028 * dt;
        if (segment && position.current >= segment * 2)
          position.current -= segment;
        if (segment && position.current < segment * 0.45)
          position.current += segment;
        row.style.transform = `translate3d(${-position.current}px,0,0)`;
        if (segment && progressBar.current)
          progressBar.current.style.transform = `translateX(${((((position.current % segment) + segment) % segment) / segment) * 733}%)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [view, active]);

  const navigate = (next: View) => {
    setView(next);
    setActive(null);
    setHovered(null);
    hoverPaused.current = false;
  };
  useEffect(()=>{
    const viewport=gallery.current;
    if(view !== 'home' || active !== null || !viewport) return;
    const wheel=(e:WheelEvent)=>{
      if(e.ctrlKey) return;
      e.preventDefault();
      e.stopPropagation();
      const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
      velocity.current=Math.max(-18,Math.min(18,velocity.current+delta*.12));
    };
    viewport.addEventListener('wheel',wheel,{passive:false});
    return ()=>viewport.removeEventListener('wheel',wheel);
  },[view,active]);

  return (
    <main
      className="portfolio-shell"
      onPointerMove={moveCursor}
    >
      <header className="persistent-header">
        <button className="wordmark" onClick={() => navigate('home')}>
          BEIBEI (ANNA) ZHU<span>®</span>
        </button>
        <nav>
          {(['home', 'lab', 'about', 'contact'] as View[]).map((item) => (
            <button
              key={item}
              className={view === item && active === null ? 'active' : ''}
              onClick={() => navigate(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <p>
          <i /> Available for select projects
        </p>
      </header>

      {view === 'home' && active === null && (
        <div className="home-scroll">
        <section className="home-view">
          <div className="intro">
            <p>
              Independent graphic designer
              <br />
              working across identity, image & print.
            </p>
            <span>Scroll to explore →</span>
          </div>
          <div ref={gallery} className="gallery-viewport">
            <div ref={galleryRow} className="gallery-row loop-row">
              {[0, 1, 2].flatMap((loop) =>
                projects.map((project, index) => (
                    <button
                      className={`gallery-project home-composition-${index}`}
                      key={`${loop}-p-${index}`}
                      style={
                        {
                          '--cover-position': projects[index].crop,
                        } as React.CSSProperties
                      }
                      onPointerEnter={() => {
                        setHovered(index);
                        hoverPaused.current = true;
                      }}
                      onPointerLeave={() => {
                        setHovered(null);
                        hoverPaused.current = false;
                      }}
                      aria-disabled="true"
                    >
                      {index === 0 ? <HomeLoopVideo className="gallery-cover icepact-cover" /> : index === 1 ? <img className="gallery-cover shuxia-cover" src="/assets/shuxia-cover.jpg" alt="述夏SHUXIA" /> : index === 2 ? <img className="gallery-cover pocklet-cover" src="/assets/pocklet-cover.png" alt="POCKLET" /> : <img className="gallery-cover" src="/assets/home-04-cover.png" alt={project.title} style={{objectFit:'cover',objectPosition:'center',width:'100%',height:'100%'}} />}
                      <span className="gallery-index">
                        {projects[index].id}
                      </span>
                    </button>
                  ),
                ),
              )}
            </div>
          </div>
          <div className="scroll-rule">
            <span ref={progressBar} />
          </div>
          <footer>
            <span>Selected work 2024—26</span>
            <span>New York / Shanghai</span>
            <span>© 2026</span>
          </footer>
        </section>
        <section className="selected-grid">
          <header><h2>Selected work</h2><span>2024—2026</span></header>
          <div className="work-grid">{projects.map((project, index) => (
            <button key={project.id} aria-disabled="true">
              {index === 0 ? <HomeLoopVideo className="work-grid-image icepact-cover" /> : index === 1 ? <img className="work-grid-image shuxia-cover" src="/assets/shuxia-cover.jpg" alt="述夏SHUXIA" /> : index === 2 ? <img className="work-grid-image pocklet-cover" src="/assets/pocklet-cover.png" alt="POCKLET" /> : <img className="work-grid-image" src="/assets/home-04-cover.png" alt={project.title} style={{objectFit:'cover',objectPosition:'center',width:'100%',height:'100%'}} />}
              <span className="work-grid-caption"><b>{project.title}</b><span>{project.type}</span></span>
            </button>
          ))}</div>
          <div className="work-grid-end"><span>Beibei (Anna) Zhu</span><span>New York / Shanghai</span></div>
        </section>
        </div>
      )}

      {view === 'home' && active !== null && (
        <CaseStudy
          project={projects[active]}
          onBack={() => setActive(null)}
          onNext={() => setActive((active + 1) % projects.length)}
        />
      )}

      {view === 'lab' && <SphereLab />}

      {view === 'about' && (
        <section className="about-view">
          <div className="about-lead">
            <p>ABOUT / 2026</p>
            <h1>
              I’m a Shanghai-raised, Brooklyn-based communication designer
              working across branding, illustration, and creative technology.
              I’m always collecting references and paying attention to details
              other people might pass by, often pulling from culture, travel,
              and everyday observations along the way. I want the things I make
              to feel thoughtful, memorable, and above all, human.
            </h1>
          </div>
          <div className="portrait-block diffuse-portrait">
            <img
              className="portrait-base"
              src="/assets/beibei-portrait.jpg"
              alt="Portrait of Beibei Anna Zhu"
            />
            <div className="portrait-frost" />
            <p>Beibei (Anna) Zhu — Graphic &amp; Interaction Designer</p>
          </div>
          <div className="about-columns">
            <InfoColumn
              title="EXPERIENCE"
              items={[
                [
                  'China Mobile Migu — Design Intern',
                  'Key visual for a documentary on the 2026 FIFA World Cup in the U.S., Canada & Mexico',
                ],
                [
                  'M Moser Associates — Design Intern',
                  'Concept and environmental graphics for L’Oréal, Boeing & HSBC',
                ],
              ]}
            />
            <InfoColumn
              title="SKILLS"
              items={[
                [
                  'Art Direction',
                  'Concepts & visual systems',
                ],
                [
                  'Design',
                  'Identity, editorial & illustration',
                ],
                [
                  'Digital & Production',
                  'UX/UI, motion & print',
                ],
              ]}
            />
            <InfoColumn
              title="LANGUAGE"
              items={[
                ['Mandarin', 'Native'],
                ['English', 'Fluent'],
                [
                  'Design',
                  'Grids, type & thoughtful details',
                ],
              ]}
            />
            <InfoColumn
              title="HONORS"
              items={[
                [
                  'Pratt Annual Design Exhibition',
                  'Selected, 2024—26',
                ],
                [
                  'Pratt One Exhibition',
                  'Cover illustration, 2023—24',
                ],
                [
                  'Outstanding Book Selection',
                  'National jury, 2025',
                ],
              ]}
            />
          </div>
        </section>
      )}

      {view === 'contact' && (
        <section className="contact-view">
          <p>CONTACT</p>
          <h1>
            Have something
            <br />
            interesting in mind?
          </h1>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=zhubeibei28%40gmail.com&su=Portfolio%20inquiry"
            target="_blank"
            rel="noreferrer"
          >
            zhubeibei28@gmail.com <ArrowUpRight />
          </a>
          <div>
            <a
              href="https://www.instagram.com/bb.0_4/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/beibei-anna-zhu-98a9943aa"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <button
              className="resume-download"
              type="button"
              aria-disabled="true"
              title="Résumé PDF coming soon"
            >
              <span>Download résumé</span>
              <small>PDF soon</small>
              <ArrowDownToLine />
            </button>
            <span>New York / Shanghai</span>
          </div>
        </section>
      )}
      {hovered !== null && (
        <div
          className="project-cursor"
          ref={cursorLabel}
          style={{
            transform: `translate3d(${cursor.current.x + 18}px,${cursor.current.y + 18}px,0)`,
          }}
        >
          <b>{projects[hovered].title}</b>
          <span>{projects[hovered].type}</span>
        </div>
      )}
    </main>
  );
}

function CaseStudy({
  project,
  onBack,
  onNext,
}: {
  project: (typeof projects)[number];
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="case-study">
      <button className="case-back" onClick={onBack}>
        <ArrowLeft size={15} /> Home
      </button>
      <section className="case-hero">
        <div
          className="case-hero-image"
          style={{ backgroundPosition: project.crop }}
        />
        <div>
          <p>
            {project.id} / {project.year}
          </p>
          <h1>{project.title}</h1>
          <span>{project.type}</span>
        </div>
      </section>
      <section className="case-overview">
        <p>OVERVIEW</p>
        <h2>{project.text}</h2>
        <div>
          <article>
            <span>THE BRIEF</span>
            <p>{project.brief}</p>
          </article>
          <article>
            <span>THE IDEA</span>
            <p>{project.idea}</p>
          </article>
        </div>
      </section>
      <section className="case-process">
        <header>
          <p>PROCESS / 01—03</p>
          <h2>
            From loose material
            <br />
            to a flexible system.
          </h2>
        </header>
        <div className="process-grid">
          <div className="process-image crop-a" />
          <div className="process-note">
            <span>01 / COLLECT</span>
            <p>
              Research, references and visual fragments were gathered without
              hierarchy.
            </p>
          </div>
          <div className="process-note">
            <span>02 / REDUCE</span>
            <p>
              Repeated forms revealed the smallest set of useful components.
            </p>
          </div>
          <div className="process-image crop-b" />
        </div>
      </section>
      <section className="case-system">
        <div>
          <p>SYSTEM</p>
          <h2>
            One visual language,
            <br />
            many temperatures.
          </h2>
        </div>
        <div className="system-strip">
          {['0% 0%', '100% 0%', '0% 100%', '100% 100%'].map((crop) => (
            <span key={crop} style={{ backgroundPosition: crop }} />
          ))}
        </div>
      </section>
      <section className="case-outcome">
        <div
          className="outcome-image"
          style={{ backgroundPosition: project.crop }}
        />
        <div>
          <p>FINAL OUTCOME</p>
          <h2>A recognisable world designed to keep changing.</h2>
          <button onClick={onNext}>
            Next project <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
    </section>
  );
}

function InfoColumn({ title, items }: { title: string; items: string[][] }) {
  return (
    <section className="info-column">
      <h2>{title}</h2>
      {items.map(([name, description]) => (
        <article key={name}>
          <h3>{name}</h3>
          <p>{description}</p>
        </article>
      ))}
    </section>
  );
}

// Add real video and full-resolution assets here as each study is supplied.
const labMedia: Record<string, {video?: string; images?: string[]; pdf?: string; hoverImages?: string[]; cover?: string; detailInterval?: number; animation?: string}> = {
  '12': {images: ['/assets/lab/lantern-recall/cover.webp'], video: '/assets/lab/lantern-recall/lantern-recall.mp4'},
  '01': {images: ['/assets/lab/reverie-animation.webp'], video: '/assets/lab/reverie-animation.mp4'},
  '02': {images: ['/assets/lab/reverie-model.webp'], video: '/assets/lab/reverie-model.mp4'},
  '03': {images: ['/assets/lab/connect-poster-1.webp'], pdf: '/assets/lab/connect-poster.pdf'},
  '04': {images: Array.from({length:6}, (_,i) => `/assets/lab/paper-pattern-${i+1}.webp`)},
  '05': {cover: '/assets/lab/windows-of-perception.webp', images: Array.from({length:8},(_,i)=>`/assets/lab/windows-zine/page-${i+1}.webp`)},
  '11': {images: ['/assets/lab/the-orbit.webp']},
  '10': {cover: '/assets/lab/ambers-pulses/cover.webp', hoverImages: Array.from({length:9},(_,i)=>`/assets/lab/ambers-pulses/hover-${i+1}.webp`), images: Array.from({length:9},(_,i)=>`/assets/lab/ambers-pulses/detail-${i+1}.webp`), detailInterval:3000},
  '09': {cover: '/assets/lab/food-on-record/cover-1.webp', hoverImages: Array.from({length:26},(_,i)=>`/assets/lab/food-on-record/hover-${i+1}.webp`), images: Array.from({length:15},(_,i)=>`/assets/lab/food-on-record/detail-${i+1}.webp`), detailInterval:3000},
  '08': {images: ['/assets/lab/make-her-visible-model-1.webp', '/assets/lab/make-her-visible-model-2.webp']},
  '07': {images: ['/assets/lab/objects-display-cover.webp', '/assets/lab/objects-display-poster.webp', '/assets/lab/objects-display-tickets.webp']},
  '06': {images: ['/assets/lab/make-her-visible.webp'], video: '/assets/lab/make-her-visible-final.mp4'},
};

const labDescriptions: Record<string, {meta: string; description: string}> = {
  "12": {meta: "2026 · Creative Coding / Animation", description: "A pixel-based animation of two children hanging lanterns"},
  "01": {
    "meta": "2025 · 2D Motion / Illustration / Editorial",
    "description": "A 2D animation using layered, sketch-like visuals to capture the dreamy, slightly uneasy mood of Chinese Dreamcore."
  },
  "02": {
    "meta": "2025 · 3D Modeling / Motion / Brand Identity",
    "description": "A 3D brand animation for Reverie, designed as a recurring visual symbol across intros, websites, and promotional displays. The glowing elephant translates the brand’s dreamlike, nostalgic tone into a distinct three-dimensional identity."
  },
  "03": {
    "meta": "2024 · Poster Design / Illustration / Typography",
    "description": "A poster that rebuilds the Chinese character 要 through a bow and two intertwined figures, turning the word itself into an image of wanting, reaching, and connection."
  },
  "04": {
    "meta": "2026 · Risograph / Pattern Design / Printmaking",
    "description": "A series of Risograph prints exploring how repeated shapes, cultural motifs, and layered color can build a flexible visual pattern system across multiple compositions."
  },
  "05": {
    "meta": "2025 · Editorial Design / Photography",
    "description": "A zine exploring how windows, reflections, and blurred surfaces shift the way we see memory and place."
  },
  "06": {
    "meta": "2025 · 3D Motion / Social Campaign / Visual Symbol",
    "description": "A 3D-modeled motion piece using a blooming magnolia as a shareable symbol of feminine strength and visibility."
  },
  "07": {
    "meta": "2025 · Exhibition Identity / Illustration / Editorial Design",
    "description": "A fictional exhibition identity exploring how women have been framed and displayed across art history. The system includes an exhibition poster inspired by historical female figures and a receipt-style admission ticket that turns viewing into a form of cataloging and display."
  },
  "08": {
    "meta": "2026 · 3D Motion / Typography / Visual Research",
    "description": "A 3D motion piece transforming the Chinese character 她 (“she/her”) from a cage-like structure into a symbol of reformation inspired by Nüshu."
  },
  "09": {
    "meta": "2024 · Editorial Design / Illustration / Visual Storytelling",
    "description": "A publication connecting music, food, and everyday city life through personal memories in Shanghai. Playlists, flavors, photography, and illustration come together as a visual record of how sound and taste can shape a sense of place."
  },
  "10": {
    "meta": "2024 · Zine / Editorial Design / Illustration",
    "description": "A visual zine capturing the sensory memories of an Asian summer through markets, family, heat, rain, and everyday sounds."
  },
  "11": {
    "meta": "2024 · Illustration",
    "description": "A surreal imagined world exploring movement, connection, and discovery through shifting forms and pathways."
  }
};

// Keep a short closing phrase together even where pretty wrapping is unsupported.
function preventWidow(text: string = '') {
  const words = text.trim().split(/\s+/);
  if (words.length < 3) return text;
  const closing = words.slice(-3).join(' ');
  const count = closing.length <= 32 ? 3 : 2;
  return words.slice(0, -count).join(' ') + ' ' + words.slice(-count).join('\u00a0');
}

function LabWorkTitle({title}: {title:string}) {
  const words = title.split(' ');
  if(words.length < 3) return <>{title}</>;
  return <>{words.slice(0,-2).join(' ')} <span className="lab-title-ending">{words.slice(-2).join(' ')}</span></>;
}

function LabPreviewVideo({src, playing, poster}: {src: string; playing: boolean; poster?: string}) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const clip = video.current;
    if (!clip) return;
    let cancelled = false;
    const start = () => {
      if (cancelled || !playing) return;
      clip.muted = true;
      clip.play().catch(() => {});
    };
    if (playing) {
      clip.addEventListener('loadeddata', start);
      clip.addEventListener('canplay', start);
      start();
    } else {
      clip.pause();
      if (clip.readyState > 0) clip.currentTime = 0;
    }
    return () => { cancelled = true; clip.removeEventListener('loadeddata', start); clip.removeEventListener('canplay', start); };
  }, [playing, src]);
  return <><img className="lab-video-cover" src={poster} alt="" draggable={false} /><video ref={video} src={playing ? src : undefined} poster={poster} style={{opacity: playing ? 1 : 0}} muted loop playsInline preload="none" /></>;
}

function LabSlideshow({images, playing = false, title, controls = false, interval = 700, cover}: {images: string[]; playing?: boolean; title: string; controls?: boolean; interval?: number; cover?: string}) {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (!playing) { setSlide(0); return; }
    const first = window.setTimeout(() => setSlide(1 % images.length), controls ? interval : 250);
    const timer = window.setInterval(() => setSlide(i => (i+1)%images.length), interval);
    return () => { window.clearTimeout(first); window.clearInterval(timer); };
  }, [playing, images, interval, controls]);
  return <div className={controls ? 'lab-photo-gallery' : 'lab-photo-preview'}>
    {images.map((src,i) => (i===slide || i===(slide+1)%images.length) ? <img key={src} src={!playing && cover && i===0 ? cover : src} alt={`${title} — ${i+1}`} draggable={false} style={{visibility:slide===i ? 'visible' : 'hidden'}} /> : null)}
    {controls && <div className="lab-photo-controls"><button aria-label="Previous photo" onClick={()=>setSlide(i=>(i+images.length-1)%images.length)}>Previous</button><span>{slide+1} / {images.length}</span><button aria-label="Next photo" onClick={()=>setSlide(i=>(i+1)%images.length)}>Next</button></div>}
  </div>;
}

function SphereLab() {
  const [labMenuOpen, setLabMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [angle, setAngle] = useState(0);
  const [tilt, setTilt] = useState(-.12);
  const [dragging, setDragging] = useState(false);
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);
  const [labelCursor, setLabelCursor] = useState<{x:number;y:number} | null>(null);
  const pointer = useRef({x: 0, y: 0, moved: false});
  const reduced = useRef(false);
  useEffect(() => { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  useEffect(() => {
    if (selected !== null || dragging || hoveredPiece !== null || reduced.current) return;
    let frame: number;
    let last = performance.now();
    const tick = (now: number) => {
      setAngle(a => a + Math.min(now-last, 40) * .00008);
      last = now; frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [selected, dragging, hoveredPiece]);
  return <section className="sphere-lab">
    <header className="sphere-heading">
      <div className="lab-title-menu" onMouseEnter={()=>setLabMenuOpen(true)} onMouseLeave={()=>setLabMenuOpen(false)} onFocus={()=>setLabMenuOpen(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setLabMenuOpen(false);}} onKeyDown={e=>{if(e.key==='Escape')setLabMenuOpen(false);}}>
        <h1><button className="lab-title-trigger" aria-expanded={labMenuOpen} aria-controls="lab-work-list" onClick={()=>setLabMenuOpen(open=>!open)}>Lab</button></h1>
        {labMenuOpen && <div id="lab-work-list" className="lab-work-list" aria-label="Lab works">{experiments.map((work,index)=><button key={work[0]} onClick={()=>{setSelected(index);setLabMenuOpen(false);setHoveredPiece(null);setLabelCursor(null);}}>{work[1]}</button>)}</div>}
      </div>
      <p>Studies, fragments & playful ideas.</p>
    </header>
    <div className="sphere-stage" aria-label="Experimental work gallery"
      onWheel={e => { if(selected !== null) return; setAngle(a => a + e.deltaX * .003 + e.deltaY * .0025); setTilt(t => Math.max(-.7, Math.min(.7, t + e.deltaY * .0007))); }}
      onPointerDown={e => { pointer.current = {x:e.clientX,y:e.clientY,moved:false}; setDragging(true); if (!(e.target as HTMLElement).closest("button")) e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={e => { if (!dragging) return; const dx=e.clientX-pointer.current.x, dy=e.clientY-pointer.current.y; if(Math.abs(dx)+Math.abs(dy)>3) pointer.current.moved=true; setAngle(a=>a+dx*.006); setTilt(t=>Math.max(-.7,Math.min(.7,t+dy*.003))); pointer.current.x=e.clientX;pointer.current.y=e.clientY; }}
      onPointerUp={e => { setDragging(false); if(e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
      onPointerCancel={() => setDragging(false)}>
      <div className={`sphere-orbit${hoveredPiece !== null ? " has-preview" : ""}`}>
      {Array.from({length:12},(_,i)=>{
        const y=1-2*(i+.5)/12, radius=Math.sqrt(1-y*y), phi=i*2.399963229728653+angle;
        const x=Math.cos(phi)*radius, z=Math.sin(phi)*radius;
        const ry=y*Math.cos(tilt)-z*Math.sin(tilt), rz=y*Math.sin(tilt)+z*Math.cos(tilt);
        const n=i%experiments.length; const depth=(rz+1)/2; const scale=.58+depth*.85; const perspective=1/(1-rz*.18);
        return <button key={i} className={`sphere-piece${hoveredPiece===i ? " is-hovered" : ""}${n===5 ? " square-video" : ""}${n===7 ? " square-model" : ""}${n===3 ? " larger-paper" : ""}${n===10 ? " larger-orbit" : ""}${n===11 ? " compact-lantern" : ""}`} aria-label={`Open ${experiments[n][1]}`} tabIndex={selected===null && rz > .12 ? 0 : -1}
          style={{'--sx':x*perspective,'--sy':ry*perspective,'--scale':scale,'--aspect':n===2 ? '0.6925' : n===0 ? '1.313' : n===1 ? '1.479' : n===3 ? '1.333' : n===5 ? '1' : n===7 ? '1' : n===8 ? '1' : n===9 ? '0.773' : n===10 ? '2.686' : n===11 ? '0.64' : '1.5',pointerEvents:rz > .12 ? 'auto' : 'none',opacity:rz < 0 ? 1 + rz*.22 : 1,filter:rz < -.35 ? 'blur(.3px)' : 'none',zIndex:Math.round((rz+1)*20),animationDelay:`${i*22}ms`} as React.CSSProperties}
          onMouseEnter={e => {
            if (rz <= .12) return;
            setHoveredPiece(i);
            setLabelCursor({x:e.clientX,y:e.clientY});
            const clip = e.currentTarget.querySelector('video');
            if (clip) { clip.muted = true; clip.play().catch(() => {}); }
          }}
          onMouseMove={e => { if (!dragging && rz > .12) {
            setHoveredPiece(i);setLabelCursor({x:e.clientX,y:e.clientY});
            const clip=e.currentTarget.querySelector('video');
            if(clip && clip.paused) {clip.muted=true;clip.play().catch(()=>{});}
          } }}
          onPointerLeave={() => {setHoveredPiece(null);setLabelCursor(null);}}
          onFocus={() => setHoveredPiece(i)} onBlur={() => setHoveredPiece(null)}
          onClick={()=>{ if(!pointer.current.moved) {setSelected(n);setHoveredPiece(null);} }}>
          {labMedia[String(experiments[n][0])]?.video
            ? <LabPreviewVideo src={labMedia[String(experiments[n][0])].video!} poster={labMedia[String(experiments[n][0])].images?.[0]} playing={hoveredPiece===i} />
            : n===4 ? <LabSlideshow images={labMedia['05'].images!} cover={labMedia['05'].cover} playing={hoveredPiece===i} title="Windows of Perception" />
            : n===9 ? <LabSlideshow images={labMedia['10'].hoverImages!} cover={labMedia['10'].cover} playing={hoveredPiece===i} title="Amber’s Pulses Zine" />
            : n===8 ? <LabSlideshow images={labMedia['09'].hoverImages!} cover={labMedia['09'].cover} playing={hoveredPiece===i} title="磁带食记 Food on Record" />
            : n===3 ? <LabSlideshow images={labMedia['04'].images!} playing={hoveredPiece===i} title="Paper In Pattern" />
            : <img src={labMedia[String(experiments[n][0])]?.images?.[0]} alt={experiments[n][1]} draggable={false} /> }
          <span className="sphere-piece-label">{experiments[n][1]}</span>
        </button>;
      })}
      </div>
    </div>
    {hoveredPiece !== null && labelCursor && selected === null && <div className="lab-mouse-title" style={{left:labelCursor.x+14,top:labelCursor.y+16}}>{experiments[hoveredPiece % experiments.length][1]}</div>}
    <footer className="sphere-footer"><span>Drag or scroll to explore · Select to view</span><span>Ongoing / 2026</span></footer>
    {selected!==null && <div className="lab-focus" role="dialog" aria-modal="true" aria-label={String(experiments[selected][1])} onKeyDown={e=>{if(e.key==='Escape')setSelected(null);}}>
      <button autoFocus className="lab-focus-close" onClick={()=>setSelected(null)}>Close ×</button>
      <div className="lab-focus-visual" key={selected}>
        {labMedia[String(experiments[selected][0])]?.animation
          ? <iframe src={labMedia[String(experiments[selected][0])].animation} title="Lantern Recall" className="lantern-animation" />
          : labMedia[String(experiments[selected][0])]?.video
          ? <video src={labMedia[String(experiments[selected][0])].video} poster={labMedia[String(experiments[selected][0])].images?.[0]} controls autoPlay playsInline preload="metadata" />
          : labMedia[String(experiments[selected][0])]?.images?.length
            ? <LabSlideshow images={labMedia[String(experiments[selected][0])].images!} title={experiments[selected][1]} playing={!!labMedia[String(experiments[selected][0])].detailInterval} interval={labMedia[String(experiments[selected][0])].detailInterval ?? 700} controls={labMedia[String(experiments[selected][0])].images!.length > 1} />
            : <span style={{backgroundPosition:`${Number(experiments[selected][3])*20}% 50%`}} />}
      </div>
      <div className="lab-focus-copy"><span>Study {experiments[selected][0]}</span><h2><LabWorkTitle title={experiments[selected][1]} /></h2><p className="lab-study-meta">{preventWidow(labDescriptions[experiments[selected][0]]?.meta)}</p><p className="lab-study-description">{preventWidow(labDescriptions[experiments[selected][0]]?.description)}</p>{labMedia[String(experiments[selected][0])]?.pdf && <a className="lab-original-pdf" href={labMedia[String(experiments[selected][0])].pdf} target="_blank" rel="noreferrer">View original PDF</a>}<button onClick={()=>setSelected((selected+1)%experiments.length)}>Next study</button></div>
    </div>}
  </section>;
}

function HomeLoopVideo({className}: {className:string}) {
  const clip=useRef<HTMLVideoElement>(null);
  const [visible,setVisible]=useState(false);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    if(!clip.current)return;
    const observer=new IntersectionObserver(([entry])=>{setVisible(entry.isIntersecting);if(entry.isIntersecting)setLoaded(true);},{threshold:.05});
    observer.observe(clip.current);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{if(visible)clip.current?.play().catch(()=>{});else clip.current?.pause();},[visible,loaded]);
  return <video ref={clip} className={className} src={loaded ? '/assets/icepact.mp4' : undefined} poster="/assets/icepact-poster.webp" muted loop playsInline preload="none" onLoadedData={()=>{if(visible)clip.current?.play().catch(()=>{});}} />;
}
