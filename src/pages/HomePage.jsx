import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SectionHeader } from '@components/ui';
import { ExperienceCard, ProjectCard, SkillsBox } from '@components/sections';
import { useLanguage } from '@context/LanguageContext';
import data from '../data/portfolioData.json';

const { experiences, projects, skills } = data;

export default function HomePage({ section = 'experience' }) {
    const { loaded } = useOutletContext();
    const { t } = useLanguage();

    const yearsOfExperience = useMemo(() => new Date().getFullYear() - 2022, []);

    return (
        <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease'
        }}>
            {section === 'experience' && (
                <section>
                    <SectionHeader
                        title={t.experience}
                        count={`${experiences.length} ${t.posts} · ${yearsOfExperience} ${t.years}`}
                    />
                    <div style={{ marginTop: '8px' }}>
                        {experiences.map((exp, index) => (
                            <ExperienceCard
                                key={exp.id}
                                experience={exp}
                                isLast={index === experiences.length - 1}
                            />
                        ))}
                    </div>
                    <SkillsBox skills={skills} />
                </section>
            )}

            {section === 'projects' && (
                <section>
                    <SectionHeader
                        title={t.projects}
                        count={`${projects.length} ${t.entries}`}
                    />
                    <div>
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
