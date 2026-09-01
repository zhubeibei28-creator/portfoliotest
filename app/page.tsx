'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';

const projects = [
  { id: '01', title: 'Soft Machinery', type: 'Identity / Art Direction', year: '2026', crop: '0% 0%', text: 'A modular identity built from soft systems, hard edges, and fluorescent matter.' },
  { id: '02', title: 'Orbital Studies', type: 'Campaign / 3D', year: '2025', crop: '100% 0%', text: 'A campaign where chrome forms behave like an alphabet from another orbit.' },
  { id: '03', title: 'Red Assembly', type: 'Editorial / Print', year: '2025', crop: '0% 100%', text: 'An editorial system about fragments, repetition, and the pleasure of misregistration.' },
  { id: '04', title: 'Tender Objects', type: 'Digital / Image-making', year: '2024', crop: '100% 100%', text: 'A series of strange, friendly objects made for screens, spaces, and small encounters.' },
];

const pieces = [
  { kind: 'element', element: 0, className: 'el el-tall', label: 'Field note 01' },
  { kind: 'project', project: 0 },
  { kind: 'element', element: 1, className: 'el el-chain', label: 'Lucky link' },
  { kind: 'project', project: 1 },
  { kind: 'element', element: 2, className: 'el el-face', label: 'Soft study' },
  { kind: 'project', project: 2 },
  { kind: 'element', element: 3, className: 'el el-tube', label: 'Loop test' },
  { kind: 'project', project: 3 },
  { kind: 'element', element: 4, className: 'el el-dice', label: 'Chance object' },
  { kind: 'element', element: 5, className: 'el el-tool', label: 'Useful / useless' },
] as const;

export default function Home() {
  const [active, setActive] = useState<number | null>(null);
  const [panel, setPanel] = useState<'about' | 'contact' | null>(null);
  const [offset, setOffset] = useState(-180);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const moved = useRef(false);

  useEffect(() => {
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setOffset((v) => Math.max(-1620, Math.min(50, v + velocity.current * 18)));
    };
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, []);

  const move = (e: React.PointerEvent) => {
    setCursor({ x: e.clientX, y: e.clientY, visible: true });
    if (dragging.current) {
      const delta = e.clientX - lastX.current;
      if (Math.abs(delta) > 2) moved.current = true;
      setOffset((v) => Math.max(-1620, Math.min(50, v + delta)));
      velocity.current = delta;
      lastX.current = e.clientX;
    }
  };
  const close = () => { setActive(null); setPanel(null); };

  return (
    <main className="site-shell" onPointerMove={move} onPointerLeave={() => setCursor((v) => ({ ...v, visible: false }))}>
      <header className="topbar">
        <a className="wordmark" href="#work" aria-label="Return to work">MING ZHOU<span>®</span></a>
        <nav aria-label="Main navigation">
          <button className={!panel ? 'is-active' : ''} onClick={close}>Work</button>
          <button className={panel === 'about' ? 'is-active' : ''} onClick={() => { setPanel('about'); setActive(null); }}>About</button>
          <button className={panel === 'contact' ? 'is-active' : ''} onClick={() => { setPanel('contact'); setActive(null); }}>Contact</button>
        </nav>
        <p className="availability"><i /> Available for select projects</p>
      </header>

      <section id="work" className="stage" aria-label="Selected work">
        <div className="stage-copy">
          <p>Independent graphic designer<br />working across identity, image & print.</p>
          <span className="drag-note"><ArrowLeft size={15} /> Swipe / drag to explore <ArrowRight size={15} /></span>
        </div>
        <div className="track" style={{ transform: `translate3d(${offset}px, 0, 0)` }} onPointerDown={(e) => { dragging.current = true; moved.current = false; velocity.current = 0; lastX.current = e.clientX; }}>
          {pieces.map((piece, index) => {
            if (piece.kind === 'project') {
              const project = projects[piece.project];
              return <button className="project-card" key={project.id} onPointerEnter={() => setHovered(piece.project)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(piece.project)} onBlur={() => setHovered(null)} onClick={() => { if (!moved.current) setActive(piece.project); moved.current = false; }} aria-label={`Open project ${project.title}`}>
                <span className="cover" style={{ backgroundPosition: project.crop }} />
                <span className="card-caption"><b>{project.title}</b><small>{project.type}</small></span>
                <span className="card-number">{project.id}</span>
              </button>;
            }
            return <div key={`${piece.label}-${index}`} className={`element-card ${piece.className}`} aria-label={piece.label}><span style={{ backgroundPosition: `${piece.element * 20}% 50%` }} /></div>;
          })}
        </div>
        <div className="rail" aria-hidden="true"><span style={{ transform: `translateX(${Math.min(730, Math.max(0, (-offset / 1620) * 730))}%)` }} /></div>
      </section>

      <footer><span>Selected work 2024—26</span><span>New York / Shanghai</span><span>© 2026</span></footer>

      <div className={`cursor-label ${cursor.visible ? 'is-visible' : ''} ${hovered !== null ? 'has-project' : ''}`} style={{ transform: `translate3d(${cursor.x + 18}px, ${cursor.y + 18}px, 0)` }} aria-hidden="true">
        <i />{hovered !== null && <span>{projects[hovered].title}<small>View project</small></span>}
      </div>

      {active !== null && <section className="detail" aria-modal="true" role="dialog" aria-label={projects[active].title}>
        <button className="close" onClick={close}><ArrowLeft size={18} /> Back to work</button>
        <div className="detail-visual" style={{ backgroundPosition: projects[active].crop }} />
        <div className="detail-info">
          <p>{projects[active].id} / {projects[active].year}</p>
          <h1>{projects[active].title}</h1>
          <div><span>{projects[active].type}</span><p>{projects[active].text}</p></div>
          <button className="next" onClick={() => setActive((active + 1) % projects.length)}>Next project <ArrowUpRight size={18} /></button>
        </div>
      </section>}

      {panel && <section className="info-panel" aria-modal="true" role="dialog" aria-label={panel}>
        <button className="panel-close" onClick={close}><X size={22} /></button>
        <p className="eyebrow">{panel === 'about' ? 'About the studio' : 'Start a conversation'}</p>
        {panel === 'about' ? <><h2>Ideas first.<br />Decoration second.<br /><em>Play always.</em></h2><p className="panel-body">Ming is an independent graphic designer creating identities, campaigns, publications and images for cultural and forward-looking clients.</p></> : <><h2>Have something<br />interesting in mind?</h2><a className="email" href="mailto:hello@mingzhou.design">hello@mingzhou.design <ArrowUpRight /></a><p className="panel-body">Available for commissions, collaborations and the occasional beautifully strange brief.</p></>}
      </section>}
    </main>
  );
}
