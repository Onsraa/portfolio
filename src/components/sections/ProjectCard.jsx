import {useId, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, Award, Calendar, Code2} from 'lucide-react';
import {useTheme} from '@context/ThemeContext';
import {useLanguage} from '@context/LanguageContext';
import {TranslationBadge} from '@components/ui';
import ProjectIcon from '@components/ui/ProjectIcon';
import {Disclosure, DetailsToggle} from '@components/ui/Disclosure';

export default function ProjectCard({project}) {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const detailsId = useId();
    const {colors} = useTheme();
    const {t, language, getLocalized} = useLanguage();
    const icon = {size: 13, strokeWidth: 1.8, 'aria-hidden': true};

    const title = getLocalized(project, 'title');
    const description = getLocalized(project, 'description');
    const award = project.award;
    const toggle = () => setOpen((o) => !o);
    // a click anywhere on the row opens or closes it, except on its own links and buttons
    const rowClick = (e) => { if (!e.target.closest('a, button')) toggle(); };

    const awardStyle = {display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0', padding: '3px 10px', fontSize: '12px', color: colors.text, border: `1px solid ${colors.accent}`, textDecoration: 'none'};
    const linkStyle = {display: 'inline-flex', alignItems: 'center', gap: '6px', color: colors.textMuted, fontSize: '12px', textDecoration: 'none', marginLeft: '6px'};

    return (
        <div
            className="project-card"
            onClick={rowClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'grid',
                gridTemplateColumns: '56px minmax(0, 1fr)',
                gap: '20px',
                alignItems: 'start',
                padding: '24px 0',
                borderBottom: `1px solid ${colors.borderLight}`,
                transition: 'all 0.15s ease',
                background: hovered ? colors.bgHover : 'transparent',
                marginLeft: hovered ? '8px' : '0',
                paddingLeft: hovered ? '16px' : '0',
                cursor: 'pointer',
            }}
        >
            <ProjectIcon projectId={project.project_id} color={colors.textMuted} accent={colors.accent} fast={hovered}/>
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px', flexWrap: 'wrap', gap: '8px'}}>
                    <div style={{display: 'flex', alignItems: 'baseline', gap: '16px', minWidth: 0}}>
                        <span style={{color: colors.textDarker, fontSize: '14px'}}>{project.project_id}</span>
                        <h3 style={{margin: 0, fontSize: '17px', fontWeight: 400}}>
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{color: hovered ? colors.accent : colors.text, textDecoration: 'none', transition: 'color 0.15s ease'}}
                            >
                                {hovered && <span style={{color: colors.textDark}}>./</span>}
                                {title.value}
                            </a>
                            <TranslationBadge show={title.needsTranslation}/>
                        </h3>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <span style={{color: colors.textDarker, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                            <Calendar {...icon}/>{project.year}
                        </span>
                        <DetailsToggle open={open} onToggle={toggle} controls={detailsId}/>
                    </div>
                </div>

                {award && (award.article
                    ? <Link to={`/articles/${award.article}`} style={awardStyle}><Award {...icon} size={14}/>{award[language] ?? award.en}</Link>
                    : <span style={awardStyle}><Award {...icon} size={14}/>{award[language] ?? award.en}</span>
                )}

                {/* one line while closed, the whole description once opened */}
                <p className={open ? undefined : 'clamp-1'} style={{margin: 0, color: colors.textSecondary, fontSize: '14px', lineHeight: 1.7, maxWidth: '640px'}}>
                    {description.value}
                    <TranslationBadge show={description.needsTranslation}/>
                </p>

                <Disclosure id={detailsId} open={open}>
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '14px'}}>
                        {(project.tech || []).map((tech, i) => (
                            <span
                                key={i}
                                style={{
                                    color: colors.textDark,
                                    fontSize: '12px',
                                    padding: '3px 10px',
                                    border: `1px solid ${colors.borderLight}`,
                                    background: hovered ? colors.border : 'transparent',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                        <a href={project.link} target="_blank" rel="noopener noreferrer" style={linkStyle}><ArrowUpRight {...icon}/>{t.openProject}</a>
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" style={linkStyle}><Code2 {...icon}/>github</a>
                        )}
                    </div>
                </Disclosure>
            </div>
        </div>
    );
}
