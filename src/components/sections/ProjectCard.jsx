import {useId, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, Award, Calendar, Code2} from 'lucide-react';
import {useTheme} from '@context/ThemeContext';
import {useLanguage} from '@context/LanguageContext';
import {TranslationBadge} from '@components/ui';
import ProjectIcon from '@components/ui/ProjectIcon';
import {Disclosure} from '@components/ui/Disclosure';

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

    // the description's type size and line height: one line of it stays visible while the row is closed
    const DESC_SIZE = 14, DESC_LINE = 1.7;
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
                padding: '22px 0',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
                // the highlight reaches a little left of the row and moves nothing
                background: hovered ? `linear-gradient(90deg, ${colors.bgHover} 0%, transparent 100%)` : 'transparent',
                boxShadow: hovered ? `-16px 0 0 0 ${colors.bgHover}` : 'none',
                cursor: 'pointer',
            }}
        >
            <ProjectIcon projectId={project.project_id} color={colors.textMuted} accent={colors.accent} fast={hovered}/>
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px', flexWrap: 'wrap', gap: '8px'}}>
                    <div style={{display: 'flex', alignItems: 'baseline', gap: '16px', minWidth: 0}}>
                        <span style={{color: colors.textDarker, fontSize: '14px'}}>{project.project_id}</span>
                        <h3 style={{margin: 0, fontSize: '17px', fontWeight: 400}}>
                            {/* the title is the toggle for keyboards and screen readers; a mouse can click anywhere on the row */}
                            <button type="button" aria-expanded={open} aria-controls={detailsId} onClick={toggle}
                                    style={{background: 'none', border: 0, padding: 0, font: 'inherit', textAlign: 'left', cursor: 'pointer', color: hovered ? colors.accent : colors.text, transition: 'color 0.15s ease'}}>
                                {title.value}
                            </button>
                            <TranslationBadge show={title.needsTranslation}/>
                        </h3>
                    </div>
                    <span style={{marginLeft: 'auto', color: colors.textDarker, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                        <Calendar {...icon}/>{project.year}
                    </span>
                </div>

                {award && (award.article
                    ? <Link to={`/articles/${award.article}`} style={awardStyle}><Award {...icon} size={14}/>{award[language] ?? award.en}</Link>
                    : <span style={awardStyle}><Award {...icon} size={14}/>{award[language] ?? award.en}</span>
                )}

                {/* one region opens as a single motion: the description's first line is visible while closed */}
                <Disclosure id={detailsId} open={open} collapsed={DESC_SIZE * DESC_LINE}>
                    <p style={{margin: 0, color: colors.textSecondary, fontSize: `${DESC_SIZE}px`, lineHeight: DESC_LINE, maxWidth: '640px'}}>
                        {description.value}
                        <TranslationBadge show={description.needsTranslation}/>
                    </p>
                    {/* links stay out of reach while the row is closed */}
                    <div inert={open ? undefined : ''} style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '14px'}}>
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
