import { useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useOutletContext } from 'react-router-dom';
import { SectionHeader } from '@components/ui';
import { ExperienceCard, ProjectCard } from '@components/sections';
import { useLanguage } from '@context/LanguageContext';
import data from '../data/portfolioData.json';

const { experiences, projects } = data;

export default function HomePage({ section = 'experience' }) {
    const { loaded } = useOutletContext();
    const { t } = useLanguage();

    const yearsOfExperience = useMemo(() => new Date().getFullYear() - 2022, []);
    const root = useRef(null);

    // cards rise in one after another when the section opens; skipped when the visitor asks for reduced motion
    useLayoutEffect(() => {
        if (!loaded) return;
        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.fromTo(root.current.querySelectorAll('.xp-card, .project-card'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.15 });
        }, root);
        return () => mm.revert();
    }, [loaded, section]);

    return (
        <div ref={root} style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease'
        }}>
            {section === 'experience' && (
                <section>
                    <SectionHeader
                        title={t.dirExperience}
                        count={`${experiences.length} ${t.posts} · ${yearsOfExperience} ${t.years}`}
                    />
                    <div style={{ marginTop: '8px' }}>
                        {experiences.map((exp) => (
                            <ExperienceCard key={exp.id} experience={exp} />
                        ))}
                    </div>
                </section>
            )}

            {section === 'projects' && [
                [t.dirSelected, projects.filter((p) => p.selected)],
                [t.dirOther, projects.filter((p) => !p.selected)],
            ].map(([title, list], i) => (
                <section key={title} style={{ marginTop: i ? '72px' : 0 }}>
                    <SectionHeader
                        title={title}
                        count={`${list.length} ${t.entries}`}
                    />
                    <div>
                        {list.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
