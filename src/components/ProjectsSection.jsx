import React from 'react';
import data from '../data/portfolioData.json';
import SectionHeader from './SectionHeader';
import ProjectCard from './ProjectCard';

const { projects } = data;

function ProjectsSection({ loaded }) {
    return (
        <section
            className="section-content"
            style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            }}
        >
            <SectionHeader
                title="Projets"
                count={`${projects.length} entries`}
            />

            <div>
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}

export default ProjectsSection;