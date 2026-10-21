import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Award, Calendar, Code2, Play } from 'lucide-react';
import ExperienceTimeline from '@components/sections/ExperienceTimeline';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data/portfolioData.json';

gsap.registerPlugin(ScrollTrigger);

function ProjectDiagram({ project }) {
  const cells = Array.from({ length: 70 }, (_, i) => ({ x: 60 + (i % 10) * 37, y: 50 + Math.floor(i / 10) * 33, filled: (i * 13 + project.id) % 9 < 3 }));
  return <svg className="project-diagram" viewBox="0 0 500 350" role="img" aria-label={`Conceptual diagram for ${project.title_en}`}>
    <defs><radialGradient id="study-glow"><stop stopColor="#9d9c63" stopOpacity=".28" /><stop offset="1" stopColor="#26372d" stopOpacity="0" /></radialGradient></defs>
    <circle cx="250" cy="165" r="180" fill="url(#study-glow)" />
    <g transform="translate(7 15) skewY(-8)">{cells.map((c, i) => <rect key={i} x={c.x} y={c.y} width="27" height="23" rx="2" fill={c.filled ? '#6e7854' : '#273b31'} stroke="#8d9570" strokeOpacity=".3" />)}
      <path d="M73 193 H185 V94 H335 V225 H410" stroke="#d6b772" strokeWidth="2" fill="none" strokeDasharray="5 5" />
      <path d="M110 62 V260 H300 V160 H410" stroke="#a7b6a1" strokeWidth="1.3" fill="none" strokeDasharray="3 6" />
      {[ [73,193], [185,94], [335,225], [300,160] ].map(([x,y],i) => <g key={i} className="study-agent" style={{animationDelay:`${i * .5}s`}}><circle cx={x} cy={y} r="10" fill="#d7b979" fillOpacity=".18" /><circle cx={x} cy={y} r="4" fill="#e4c787" /></g>)}
    </g>
  </svg>;
}

function ProjectExhibit() {
  const [selected, setSelected] = useState(0);
  const project = data.projects[selected];
  const info = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(info.current.children, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.05 });
    });
    return () => mm.revert();
  }, [selected]);
  const images = { 3: '/art/projects/particle-life.png', 2: '/art/projects/harmonies-wfc.png', 1: '/art/projects/machine-learning.png' };
  const [failedImages, setFailedImages] = useState({});
  const hasImage = images[project.id] && !failedImages[project.id];
  return <section className="work-section chapter-section" id="work" aria-labelledby="work-heading">
    <div className="section-overline"><span className="eyebrow">II / THE THINGS I MAKE</span><span className="collection-count">FIVE STUDIES, MANY QUESTIONS</span></div>
    <div className="section-title-row reveal"><h2 id="work-heading">Small experiments.<br /><em>Entire worlds.</em></h2><p>Simulations, systems, and the<br />possibilities between them.</p></div>
    <div className="project-exhibit">
      <div className="project-stage" key={project.id}>
        <div className="stage-topline"><span>STUDY № {project.project_id}</span><span>{project.year}</span></div>
        <div className="project-frame">{hasImage ? <img src={images[project.id]} alt={`${project.title_en} project screenshot`} onError={() => setFailedImages(prev => ({ ...prev, [project.id]: true }))} loading="lazy" /> : <ProjectDiagram project={project} />}</div>
        <div className="stage-bottomline"><span>{hasImage ? 'FROM THE PROJECT' : 'CONCEPTUAL STUDY'}</span><span>{project.tech.slice(0,2).join(' / ').toUpperCase()}</span></div>
        <span className="stage-roman" aria-hidden="true">{['V','IV','III','II','I'][selected]}</span>
      </div>
      <div className="project-info" ref={info}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{project.featured ? 'Featured work' : `Study ${project.project_id}`}</span>
        <h3 className="mt-3 whitespace-pre-line font-serif text-[clamp(32px,3.2vw,48px)] font-normal leading-[1.05] tracking-[-0.02em] text-ink">{project.id === 5 ? 'When the system\nmeets the unexpected.' : project.title_en}</h3>
        {project.id === 5 && <p className="mt-2 text-[15px] font-semibold text-moss">Multi-Agent Fault Injection Simulator</p>}
        {project.article && (
          <Link to={`/articles/${project.article.slug}`} className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-gold-soft/60 bg-gold-soft/15 px-3 py-1 text-[12px] font-semibold text-gold transition-colors hover:bg-gold-soft/30">
            <Award size={14} strokeWidth={1.8} aria-hidden="true" />Best Paper Award · AREA, PAAMS 2026
          </Link>
        )}
        <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-ink/80">{project.description_en}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-[13px] text-muted"><Calendar size={14} strokeWidth={1.8} aria-hidden="true" />{project.year}</span>
          {project.tech.map(tech => <span key={tech} className="rounded-md border border-line/80 px-2 py-0.5 text-[12px] text-muted">{tech}</span>)}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper! transition-transform hover:-translate-y-0.5">
            {project.featured ? <Play size={15} strokeWidth={2} aria-hidden="true" /> : <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />}{project.featured ? 'Enter the simulator' : 'Explore the project'}
          </a>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/40 px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-ink/5">
              <Code2 size={15} strokeWidth={2} aria-hidden="true" />Source on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
    <div className="project-index" aria-label="Select a project">{data.projects.map((p,i) => <button key={p.id} aria-pressed={selected === i} onClick={() => setSelected(i)}><span>{p.project_id}</span>{p.id === 5 ? 'MAFIS' : p.title_en.replace(' Simulator','')}<span className="project-index-arrow" aria-hidden="true">↗</span></button>)}</div>
  </section>;
}

export default function PortraitPage() {
  const root = useRef(null);
  const [chapter, setChapter] = useState(0);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = gsap.timeline({ scrollTrigger: { trigger: '.portrait-hero', start: 'top top', end: 'bottom bottom', scrub: 1 } });
      hero.to('.hero-art', { scale: 1.13, xPercent: -3, ease: 'none' }, 0)
        .to('.hero-copy', { y: -65, opacity: .05, ease: 'none' }, 0)
        .to('.hero-caption', { opacity: 0, ease: 'none' }, 0)
        .to('.hero-bottom', { opacity: 0, ease: 'none' }, 0);
      gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { y: 38, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
      gsap.fromTo('.library-invitation-art', { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.library-invitation', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }, root);
    const triggers = ['portrait','about','work','experience'].map((id,i) => ScrollTrigger.create({ trigger: `#${id}`, start: 'top 45%', end: 'bottom 45%', onEnter: () => setChapter(i), onEnterBack: () => setChapter(i) }));
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    return () => { mm.revert(); triggers.forEach(t => t.kill()); };
  }, []);

  return <main id="main-content" ref={root}>
    <aside className="chapter-rail" aria-label="Page chapters">{['portrait','about','work','experience'].map((id,i) => <a key={id} href={`#${id}`} aria-label={`Go to ${id}`} aria-current={chapter === i ? 'location' : undefined}><span className="rail-dot" /><span className="rail-label">0{i + 1}</span></a>)}</aside>
    <section className="portrait-hero" id="portrait" aria-labelledby="hero-heading">
      <div className="hero-sticky">
        <img className="hero-art" src="/art/unfinished-portrait.jpg" alt="An unfinished classical painting in a gilded frame, suspended among luminous clouds. An allegorical study, not a portrait likeness." fetchpriority="high" />
        <div className="hero-veil" />
        <div className="hero-copy">
          <div className="hero-kicker"><span className="small-star" aria-hidden="true">✳</span><span>A LIFE IN THE MAKING</span></div>
          <h1 id="hero-heading">A self,<br /><em>in progress.</em></h1>
          <p className="hero-intro">I’m Teddy. Developer, climber, curious mind.<br />This is a collection of the things that shape me.</p>
          <a className="hero-enter" href="#about"><span className="round-arrow" aria-hidden="true">↓</span>Step inside</a>
        </div>
        <div className="hero-caption"><span className="caption-line" /><span>FIG. 01<br /><em>The unfinished portrait</em></span></div>
        <div className="hero-bottom"><span><span className="scroll-line" />SCROLL TO UNFOLD</span><span>A FEW CHAPTERS. AN OPEN ENDING.</span><span>01 — 04</span></div>
      </div>
    </section>

    <section className="about-section chapter-section" id="about" aria-labelledby="about-heading">
      <div className="section-overline"><span className="eyebrow">I / BEHIND THE PORTRAIT</span><span className="collection-count">A LITTLE CONTEXT</span></div>
      <div className="about-grid"><div className="reveal"><h2 id="about-heading">Code is my medium.<br /><em>Curiosity, the reason.</em></h2><div className="about-signature">Teddy Truong <span>↗</span></div></div><div className="about-copy reveal"><p>I build software for people and for fleets of agents: co-founder and CTO of DressYou, AI engineer at the ESSEC Metalab, and researcher on multi-agent systems at UQAC.</p><p>I build worlds where a small set of rules can lead to something unexpected. Mostly in Rust. Still figuring out the lifetimes.</p><p className="about-aside">Away from the editor: climbing, games, and the next question.</p><a href="/cv.pdf" target="_blank" rel="noreferrer" className="text-link">The more formal introduction <span aria-hidden="true">↗</span></a></div></div>
      <div className="mediums"><span className="eyebrow">CURRENT MEDIUMS</span><span>Rust</span><span>Bevy</span><span>WebAssembly</span><span>Unity</span><span className="medium-end" aria-hidden="true">✳</span></div>
    </section>

    <ProjectExhibit />

    <section className="experience-section chapter-section" id="experience" aria-labelledby="experience-heading">
      <div className="section-overline"><span className="eyebrow">III / BENEATH THE SURFACE</span><span className="collection-count">THE LAYERS THAT MAKE THE WORK</span></div>
      <div className="experience-intro reveal mt-14 flex flex-wrap items-end justify-between gap-6"><h2 id="experience-heading">Nothing is made<br /><em>in isolation.</em></h2><p className="text-[15px] text-muted">Different places. Different challenges.<br />Each one leaves a layer.</p></div>
      <ExperienceTimeline experiences={data.experiences} />
    </section>

    <section className="library-invitation" aria-labelledby="library-invitation-heading">
      <img className="library-invitation-art" src="/art/library-atmosphere.jpg" alt="" loading="lazy" />
      <div className="library-invitation-content reveal"><span className="eyebrow">IV / THE THINGS THAT STAY</span><span className="library-ornament" aria-hidden="true">✳</span><h2 id="library-invitation-heading">Some worlds<br />begin <em>on a page.</em></h2><p>A room for books, thoughts in the margins,<br />and ideas worth coming back to.</p><Link to="/library" className="library-door-link">Enter the reading room <span aria-hidden="true">↗</span></Link><span className="library-preview-label">THE COLLECTION IS TAKING SHAPE</span></div>
    </section>
  </main>;
}
