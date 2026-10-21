import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { duration } from '../../data/duration.js';
import { Building2, Calendar, GraduationCap, Laptop, MapPin, Rocket, Sparkles, Train, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ICONS = { Building2, GraduationCap, Rocket, Sparkles, Train };
const month = (ym) => new Date(`${ym}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

function Entry({ exp }) {
  const Icon = ICONS[exp.icon] ?? Building2;
  return (
    <article className="xp-entry relative grid gap-x-10 gap-y-3 pb-14 pl-12 md:grid-cols-[11rem_1fr] md:pl-0">
      {/* left: when */}
      <div className="flex flex-col gap-2 md:pt-1 md:text-right">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide text-ink md:justify-end">
          <Calendar size={14} strokeWidth={1.8} aria-hidden="true" className="text-muted" />
          {month(exp.start)} – {exp.end ? month(exp.end) : 'Present'}
        </span>
        <span className="text-[12px] text-muted">{duration(exp.start, exp.end)}</span>
        <span className={`w-fit rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] md:ml-auto ${exp.is_current ? 'border-moss bg-moss text-paper' : 'border-line text-muted'}`}>
          {exp.type}
        </span>
      </div>

      {/* the dot on the timeline */}
      <span className="absolute left-0 top-0 grid size-9 place-items-center rounded-full border border-line bg-paper text-moss md:left-[12.5rem]" aria-hidden="true">
        <Icon size={17} strokeWidth={1.6} />
      </span>

      {/* right: what */}
      <div className="md:pl-16">
        <h3 className="font-sans text-[21px] font-bold leading-snug tracking-[-0.01em] text-ink md:text-[23px]">{exp.role_en}</h3>
        <p className="mt-1 font-serif text-[27px] italic leading-tight text-moss">{exp.company}</p>
        {(exp.location || exp.mode) && (
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
            {exp.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} strokeWidth={1.8} aria-hidden="true" />{exp.location}</span>}
            {exp.mode && <span className="inline-flex items-center gap-1.5"><Laptop size={14} strokeWidth={1.8} aria-hidden="true" />{exp.mode}</span>}
          </p>
        )}
        <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-ink/85">{exp.summary_en}</p>
        {exp.highlights_en.length > 0 && (
          <ul className="mt-4 flex max-w-[64ch] list-none flex-col gap-2.5 p-0">
            {exp.highlights_en.map((h) => (
              <li key={h} className="relative pl-5 text-[15px] leading-relaxed text-ink/75">
                <span className="absolute left-0 top-[0.7em] size-1.5 rounded-full bg-gold-soft" aria-hidden="true" />{h}
              </li>
            ))}
          </ul>
        )}
        {exp.achievements_en.length > 0 && (
          <div className="mt-5 max-w-[64ch] rounded-lg border border-gold-soft/50 bg-gold-soft/10 px-4 py-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">Achievements</p>
            <ul className="flex list-none flex-col gap-2 p-0">
              {exp.achievements_en.map((a) => (
                <li key={a} className="flex gap-2.5 text-[15px] leading-relaxed text-ink">
                  <Trophy size={16} strokeWidth={1.8} className="mt-[3px] shrink-0 text-gold" aria-hidden="true" />{a}
                </li>
              ))}
            </ul>
          </div>
        )}
        {exp.tech.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {exp.tech.map((t) => <span key={t} className="rounded-md border border-line/70 bg-paper px-2 py-0.5 text-[12px] text-muted">{t}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ExperienceTimeline({ experiences }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // the line draws as the section scrolls past; each entry rises in once
      gsap.fromTo('.xp-progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 } });
      gsap.utils.toArray('.xp-entry', root.current).forEach((el) => {
        gsap.from(el.children, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="relative mt-14">
      <span className="absolute bottom-14 left-[18px] top-2 w-px bg-line md:left-[calc(12.5rem+18px)]" aria-hidden="true" />
      <span className="xp-progress absolute bottom-14 left-[18px] top-2 w-px origin-top bg-moss md:left-[calc(12.5rem+18px)]" aria-hidden="true" />
      {experiences.map((exp) => <Entry key={exp.id} exp={exp} />)}
    </div>
  );
}
