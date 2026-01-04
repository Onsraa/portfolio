import React, { useState } from 'react';

function ExperienceCard({ experience, isLast }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="experience-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="experience-period-container">
                <span className="experience-period text-xs">
                    {experience.period}
                </span>

                <div className="experience-timeline-line" style={{ display: isLast ? 'none' : 'block' }} />

                {experience.current && (
                    <div className="experience-current-dot" />
                )}
            </div>

            <div className="experience-details">
                <div className="experience-header">
                    <h3 className="experience-role">
                        {experience.role}
                    </h3>
                    <span className="text-dark">@</span>
                    <span className={`experience-company-name ${experience.internship || experience.apprenticeship ? 'current' : ''}`}>
                        {experience.company}
                        {experience.current && (<span className="experience-tag now">NOW</span>)}
                    </span>

                    <span className={`experience-company-name`}>
                        {experience.internship && (
                            <span className="experience-tag internship">
                                INTERNSHIP
                            </span>
                        )}
                        {experience.apprenticeship && (
                            <span className="experience-tag apprenticeship">
                                APPRENTICESHIP
                            </span>
                        )}
                    </span>
                </div>

                <p className="experience-description text-detail">
                    {experience.description}
                </p>

                <div className="experience-tech-list">
                    {experience.tech.map((t, i) => (
                        <span key={i} className="experience-tech-tag">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExperienceCard;