import React from 'react';
import data from '../data/portfolioData.json';
import SectionHeader from './SectionHeader';
import ExperienceCard from './ExperienceCard.jsx';

const { experiences, skills } = data;

function ExperienceSection({ loaded }) {
    const yearsOfExperience = new Date().getFullYear() - 2022;

    return (
        <section
            className="section-content"
            style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            }}
        >
            <SectionHeader
                title="Expérience"
                count={`${experiences.length} postes · ${yearsOfExperience} ans`}
            />

            <div style={{ marginTop: '8px' }}>
                {experiences.map((exp, index) => (
                    <ExperienceCard
                        key={index}
                        experience={exp}
                        isLast={index === experiences.length - 1}
                    />
                ))}
            </div>

            {/* Skills */}
            <div className="skills-block">
                <div className="skills-header text-dark uppercase">
                    $ cat skills.txt
                </div>
                <div className="skills-grid">
                    <div>
                        <div className="skill-category-title uppercase">
                            Langages
                        </div>
                        <div className="skill-list">
                            {skills.langages.join(', ')}
                        </div>
                    </div>
                    <div>
                        <div className="skill-category-title uppercase">
                            Crates
                        </div>
                        <div className="skill-list">
                            {skills.crates.join(', ')}
                        </div>
                    </div>
                    <div>
                        <div className="skill-category-title uppercase">
                            Softwares
                        </div>
                        <div className="skill-list">
                            {skills.softwares.join(', ')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ExperienceSection;