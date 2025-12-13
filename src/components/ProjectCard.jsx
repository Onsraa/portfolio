import React, { useState } from 'react';

function ProjectCard({ project }) {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="project-header">
                <div className="project-title-group">
                    <span className="text-dark project-id">
                        {project.id}
                    </span>
                    <h3 className="project-title">
                        {hovered && <span className="project-link-prefix">./</span>}
                        {project.title}
                    </h3>
                </div>
                <span className="text-dark project-year text-xs">
                    {project.year}
                </span>
            </div>

            <p className="project-description text-detail">
                {project.description}
            </p>

            <div className="project-tech-list">
                {project.tech.map((t, i) => (
                    <span key={i} className="project-tech-tag">
                        {t}
                    </span>
                ))}
            </div>
        </a>
    );
}

export default ProjectCard;