'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Heart, Smile, Sparkles } from 'lucide-react';

const projects = [
  { id: '01', title: 'Soft Machinery', type: 'Identity / Art Direction', year: '2026', crop: '0% 0%', text: 'A modular identity built from soft systems, hard edges, and fluorescent matter.' },
  { id: '02', title: 'Orbital Studies', type: 'Campaign / 3D', year: '2025', crop: '100% 0%', text: 'A campaign where chrome forms behave like an alphabet from another orbit.' },
  { id: '03', title: 'Red Assembly', type: 'Editorial / Print', year: '2025', crop: '0% 100%', text: 'An editorial system about fragments, repetition, and the pleasure of misregistration.' },
  { id: '04', title: 'Tender Objects', type: 'Digital / Image-making', year: '2024', crop: '100% 100%', text: 'A series of strange, friendly objects made for screens, spaces, and small encounters.' },
];

const pieces = [
  { kind: 'element', element: 0, className: 'el-tall' }, { kind: 'project', project: 0 },
  { kind: 'element', element: 1, className: 'el-chain' }, { kind: 'project', project: 1 },
  { kind: 'element', element: 2, className: 'el-face' }, { kind: 'project', project: 2 },
  { kind: 'element', element: 3, className: 'el-tube' }, { kind: 'project', project: 3 },
  { kind: 'element', element: 4, className: 'el-dice' }, { kind: 'element', element: 5, className: 'el-tool' },
] as const;

type View = 'home' | 'about' | 'contact';

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [portraitCursor, setPortraitCursor] = useState({ x: 50, y: 50, visible: false });
  const gallery = useRef<HTMLDivElement>(null);

  const navigate = (next: View) => { setView(next); setActive(null); setHovered(null); };
  const onGalleryWheel = (e: React.WheelEvent) => {
    if (!gallery.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) gallery.current.scrollLeft += e.deltaY;
  };

  return (
    <main className="portfolio-shell" onPointerMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}>
      <header className="persistent-header">
        <button className="wordmark" onClick={() => navigate('home')}>BEIBEI (ANNA) ZHU<span>®</span></button>
        <nav aria-label="Main navigation">
          {(['home', 'about', 'contact'] as View[]).map((item) => <button key={item} className={view === item && active === null ? 'active' : ''} onClick={() => navigate(item)}>{item}</button>)}
        </nav>
        <p><i /> Available for select projects</p>
      </header>

      {view === 'home' && active === null && <section className="home-view">
        <div className="intro"><p>Independent graphic designer<br />working across identity, image & print.</p><span>Two-finger scroll to explore →</span></div>
        <div ref={gallery} className="gallery-viewport" onWheel={onGalleryWheel}>
          <div className="gallery-row">
            {pieces.map((piece, index) => piece.kind === 'project' ? (
              <button className="gallery-project" key={projects[piece.project].id} onPointerEnter={() => setHovered(piece.project)} onPointerLeave={() => setHovered(null)} onClick={() => setActive(piece.project)}>
                <span className="gallery-cover" style={{ backgroundPosition: projects[piece.project].crop }} />
                <span className="gallery-index">{projects[piece.project].id}</span>
              </button>
            ) : <div key={index} className={`gallery-element ${piece.className}`}><span style={{ backgroundPosition: `${piece.element * 20}% 50%` }} /></div>)}
          </div>
        </div>
        <div className="scroll-rule"><span /></div>
        <footer><span>Selected work 2024—26</span><span>New York / Shanghai</span><span>© 2026</span></footer>
      </section>}

      {view === 'home' && active !== null && <section className="project-detail">
        <button className="back-project" onClick={() => setActive(null)}><ArrowLeft size={15} /> Home</button>
        <div className="project-image" style={{ backgroundPosition: projects[active].crop }} />
        <div className="project-copy"><p>{projects[active].id} / {projects[active].year}</p><h1>{projects[active].title}</h1><div><span>{projects[active].type}</span><p>{projects[active].text}</p></div><button onClick={() => setActive((active + 1) % projects.length)}>Next project <ArrowUpRight size={16} /></button></div>
      </section>}

      {view === 'about' && <section className="about-view">
        <div className="about-lead"><p>ABOUT / 2026</p><h1>Independent designer shaping identities, images and printed matter with clarity and curiosity.</h1></div>
        <div className="portrait-block" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPortraitCursor({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, visible: true }); }} onPointerLeave={() => setPortraitCursor((v) => ({ ...v, visible: false }))}>
          <img src="/assets/beibei-portrait.jpg" alt="Portrait of Beibei Anna Zhu" />
          <div className={`portrait-icons ${portraitCursor.visible ? 'visible' : ''}`} style={{ left: `${portraitCursor.x}%`, top: `${portraitCursor.y}%` }}><Sparkles /><Heart /><Smile /></div>
          <p>Beibei (Anna) Zhu — Graphic Designer</p>
        </div>
        <div className="about-columns">
          <InfoColumn title="Experience" items={[['Independent Designer', 'Selected identity, editorial and campaign commissions, 2024—Present'], ['Studio Practice', 'Brand systems and art direction for cultural and creative clients, 2022—24'], ['Design Residency', 'Research-led visual experiments across image and typography, 2021']]}/>
          <InfoColumn title="Honors" items={[['Young Ones — Merit', 'Recognized for an experimental editorial identity, 2025'], ['D&AD New Blood', 'Shortlisted in graphic design and image-making, 2024'], ['Type Directors Club', 'Student showcase selection, 2023']]}/>
          <InfoColumn title="Skills" items={[['Art Direction', 'Visual concepts, campaign worlds and image systems'], ['Identity Design', 'Flexible marks, typography and brand guidelines'], ['Editorial & Digital', 'Publications, websites and motion-ready layouts']]}/>
          <InfoColumn title="Language" items={[['English', 'Professional working proficiency'], ['Mandarin', 'Native proficiency'], ['Design', 'Fluent in grids, type and strange little details']]}/>
        </div>
      </section>}

      {view === 'contact' && <section className="contact-view"><p>CONTACT</p><h1>Have something<br />interesting in mind?</h1><a href="mailto:hello@mingzhou.design">hello@mingzhou.design <ArrowUpRight /></a><div><span>Instagram</span><span>LinkedIn</span><span>New York / Shanghai</span></div></section>}

      {hovered !== null && <div className="project-cursor" style={{ transform: `translate3d(${cursor.x + 18}px,${cursor.y + 18}px,0)` }}><b>{projects[hovered].title}</b><span>View project</span></div>}
    </main>
  );
}

function InfoColumn({ title, items }: { title: string; items: string[][] }) {
  return <section className="info-column"><h2>{title}</h2>{items.map(([name, description]) => <article key={name}><h3>{name}</h3><p>{description}</p></article>)}</section>;
}
