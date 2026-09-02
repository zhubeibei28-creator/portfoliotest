'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: '01',
    title: 'Soft Machinery',
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
    title: 'Orbital Studies',
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
    title: 'Red Assembly',
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
    title: 'Tender Objects',
    type: 'Digital / Image-making',
    year: '2024',
    crop: '100% 100%',
    text: 'A series of strange, friendly objects made for screens, spaces, and small encounters.',
    brief:
      'Create a flexible image world for a programme about care, technology and the near future.',
    idea: 'Familiar expressions were embedded in unfamiliar forms, making each object feel both synthetic and oddly intimate.',
  },
];

const pieces = [
  { kind: 'element', element: 0, className: 'el-tall' },
  { kind: 'project', project: 0 },
  { kind: 'element', element: 1, className: 'el-chain' },
  { kind: 'project', project: 1 },
  { kind: 'element', element: 2, className: 'el-face' },
  { kind: 'project', project: 2 },
  { kind: 'element', element: 3, className: 'el-tube' },
  { kind: 'project', project: 3 },
  { kind: 'element', element: 4, className: 'el-dice' },
  { kind: 'element', element: 5, className: 'el-tool' },
] as const;

const experiments = [
  [
    '01',
    'Elastic Alphabet',
    'A typographic study built from tension, stretch and soft corners.',
    0,
  ],
  [
    '02',
    'Lucky Links',
    'A chain of tiny characters exploring repetition as personality.',
    1,
  ],
  [
    '03',
    'Quiet Face',
    'A portrait reduced to cavities, pauses and a single blue tone.',
    2,
  ],
  [
    '04',
    'Yellow Loop',
    'A spatial punctuation mark made to connect unrelated things.',
    3,
  ],
  [
    '05',
    'Chance Object',
    'A small system for letting accidents enter the design process.',
    4,
  ],
  [
    '06',
    'Useful / Useless',
    'A tool imagined for a task that does not yet exist.',
    5,
  ],
] as const;

type View = 'home' | 'lab' | 'about' | 'contact';

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [portraitReveal, setPortraitReveal] = useState(0);
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
        if (!hoverPaused.current)
          position.current += 0.028 * dt + velocity.current;
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
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    velocity.current = Math.max(
      -18,
      Math.min(18, velocity.current + delta * 0.12),
    );
  };

  return (
    <main
      className="portfolio-shell"
      onPointerMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
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
        <section className="home-view">
          <div className="intro">
            <p>
              Independent graphic designer
              <br />
              working across identity, image & print.
            </p>
            <span>Scroll to explore →</span>
          </div>
          <div ref={gallery} className="gallery-viewport" onWheel={onWheel}>
            <div ref={galleryRow} className="gallery-row loop-row">
              {[0, 1, 2].flatMap((loop) =>
                pieces.map((piece, index) =>
                  piece.kind === 'project' ? (
                    <button
                      className="gallery-project"
                      key={`${loop}-p-${piece.project}`}
                      style={
                        {
                          '--cover-position': projects[piece.project].crop,
                        } as React.CSSProperties
                      }
                      onPointerEnter={() => {
                        setHovered(piece.project);
                        hoverPaused.current = true;
                        velocity.current = 0;
                      }}
                      onPointerLeave={() => {
                        setHovered(null);
                        hoverPaused.current = false;
                      }}
                      onClick={() => setActive(piece.project)}
                    >
                      <span
                        className="gallery-cover"
                        style={{
                          backgroundPosition: projects[piece.project].crop,
                        }}
                      />
                      <span className="gallery-index">
                        {projects[piece.project].id}
                      </span>
                    </button>
                  ) : (
                    <div
                      key={`${loop}-e-${index}`}
                      className={`gallery-element ${piece.className}`}
                    >
                      <span
                        style={{
                          backgroundPosition: `${piece.element * 20}% 50%`,
                        }}
                      />
                    </div>
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
      )}

      {view === 'home' && active !== null && (
        <CaseStudy
          project={projects[active]}
          onBack={() => setActive(null)}
          onNext={() => setActive((active + 1) % projects.length)}
        />
      )}

      {view === 'lab' && (
        <section className="lab-view">
          <div className="lab-title">
            <p>LAB / ONGOING</p>
            <h1>
              Small experiments,
              <br />
              unfinished thoughts
              <br />
              and useful accidents.
            </h1>
          </div>
          <div className="lab-list">
            {experiments.map(([id, title, text, element]) => (
              <article key={id}>
                <div className="lab-meta">
                  <span>{id}</span>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
                <div className="lab-visual">
                  <span
                    style={{ backgroundPosition: `${element * 20}% 50%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === 'about' && (
        <section
          className="about-view"
          onScroll={(e) =>
            setPortraitReveal(
              Math.max(0, Math.min(1, e.currentTarget.scrollTop / 220)),
            )
          }
        >
          <div className="about-lead">
            <p>ABOUT / 2026</p>
            <h1>
              Beibei (Anna) Zhu is a graphic and interaction designer completing
              a BFA in Communications Design at Pratt Institute, with a minor in
              UX/UI. She turns research into visual ideas that feel clear,
              lively and considered.
            </h1>
          </div>
          <div
            className="portrait-block diffuse-portrait"
            style={{ '--reveal': portraitReveal } as React.CSSProperties}
          >
            <img
              style={{
                filter: `blur(${(1 - portraitReveal) * 18}px)`,
                opacity: 0.42 + portraitReveal * 0.58,
                transform: `scale(${1.035 - portraitReveal * 0.035})`,
              }}
              src="/assets/beibei-portrait.jpg"
              alt="Portrait of Beibei Anna Zhu"
            />
            <div
              className="glass-diffuse"
              style={{ opacity: 1 - portraitReveal }}
            />
            <p>Beibei (Anna) Zhu — Graphic &amp; Interaction Designer</p>
          </div>
          <div className="about-columns">
            <InfoColumn
              title="Experience"
              items={[
                [
                  'China Mobile Migu — Design Intern',
                  'Campaign visuals and live match graphics for the 2026 FIFA World Cup programme, Shanghai, 2026',
                ],
                [
                  'M Moser Associates — Design Intern',
                  'Concept design, illustration and environmental graphics for workplace and client-facing projects, Shanghai, 2025',
                ],
              ]}
            />
            <InfoColumn
              title="Honors"
              items={[
                [
                  'Pratt Annual Design Exhibition',
                  'Selected in consecutive annual exhibitions; work featured in exhibition promotion, 2024—26',
                ],
                [
                  'Pratt One Exhibition',
                  'Cover illustration selected as a representative visual, 2023—24',
                ],
                [
                  'Outstanding Book Selection',
                  'Nationally juried recognition for a book-design project, 2025',
                ],
              ]}
            />
            <InfoColumn
              title="Skills"
              items={[
                [
                  'Art Direction',
                  'Concept development, campaign worlds and narrative visual systems',
                ],
                [
                  'Design',
                  'Editorial, typography, visual identity, illustration and digital experiences',
                ],
                [
                  'Digital & Production',
                  'UX/UI, motion, prototyping, risograph and prepress workflows',
                ],
              ]}
            />
            <InfoColumn
              title="Language"
              items={[
                ['Mandarin', 'Native proficiency'],
                ['English', 'Fluent across academic and professional settings'],
                [
                  'Design',
                  'Fluent in grids, type, visual systems and thoughtful details',
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
          <a href="mailto:hello@mingzhou.design">
            hello@mingzhou.design <ArrowUpRight />
          </a>
          <div>
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>New York / Shanghai</span>
          </div>
        </section>
      )}
      {hovered !== null && (
        <div
          className="project-cursor"
          style={{
            transform: `translate3d(${cursor.x + 18}px,${cursor.y + 18}px,0)`,
          }}
        >
          <b>{projects[hovered].title}</b>
          <span>View project</span>
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
