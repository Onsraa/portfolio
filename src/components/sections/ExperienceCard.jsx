import {useState, useEffect, useId} from 'react';
import {Calendar, MapPin} from 'lucide-react';
import {useTheme} from '@context/ThemeContext';
import {useLanguage} from '@context/LanguageContext';
import {TranslationBadge} from '@components/ui';
import {Disclosure, DetailsToggle} from '@components/ui/Disclosure';
import {duration, monthYear} from '../../data/duration.js';

function useIsMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handler = (e) => setIsMobile(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [breakpoint]);

    return isMobile;
}

// contract type badge: label key and colours, as the card already used for apprenticeship and internship
const BADGES = {
    apprenticeship: {key: 'apprenticeship', bg: '#3858c9'},
    internship: {key: 'internship', bg: '#2e7d32'},
    fixedTerm: {key: 'fixedTerm', bg: '#7a5a1f'},
    cofounder: {key: 'cofounder', bg: '#8e2f4f'},
};

// timeline geometry: card padding, node size and where the node sits under the dates
const PAD = 32, NODE = 9, NODE_TOP = 80, BORDER = 1;
// the line runs from this node's centre to the next card's node centre
const LINE_TOP = NODE_TOP + NODE / 2, LINE_BELOW = PAD + BORDER + PAD + LINE_TOP;

const icon = {size: 13, strokeWidth: 1.8, 'aria-hidden': true, style: {flexShrink: 0}};

function Badge({label, bg, color = '#f7f7f7', size}) {
    return (
        <span style={{padding: '2px 8px', fontSize: size, color, background: bg, letterSpacing: '0.05em', whiteSpace: 'nowrap'}}>
            {label}
        </span>
    );
}

const listFor = (experience, field, language) =>
    experience[`${field}_${language}`]?.length ? experience[`${field}_${language}`] : experience[`${field}_en`] || [];

// Always visible under the role line: place and the one-line summary.
function Summary({experience, colors, language}) {
    const description = experience[`description_${language}`] || experience.description_en;
    return (
        <>
            {experience.location && (
                <div style={{marginTop: '10px', fontSize: '12px', color: colors.textMuted}}>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}><MapPin {...icon}/>{experience.location}</span>
                </div>
            )}
            {description && (
                <p style={{margin: '12px 0 0 0', color: colors.textSecondary, fontSize: '14px', lineHeight: 1.7, maxWidth: '640px'}}>
                    {description}
                </p>
            )}
        </>
    );
}

// Behind the details toggle: the bullets and the tech chips.
function More({experience, colors, language, hovered}) {
    const highlights = listFor(experience, 'highlights', language);
    return (
        <div style={{paddingTop: '4px'}}>
            {highlights.length > 0 && (
                <ul style={{listStyle: 'none', margin: '12px 0 0 0', padding: 0, maxWidth: '640px'}}>
                    {highlights.map((h, i) => (
                        <li key={i} style={{display: 'flex', gap: '10px', color: colors.textDark, fontSize: '13px', lineHeight: 1.7, marginBottom: '6px'}}>
                            <span style={{color: colors.textDarker, flexShrink: 0}}>→</span>{h}
                        </li>
                    ))}
                </ul>
            )}

            {experience.tech.length > 0 && (
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px'}}>
                    {experience.tech.map((tech, i) => (
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
                </div>
            )}
        </div>
    );
}

export default function ExperienceCard({experience, isLast}) {
    const [hovered, setHovered] = useState(false);
    const {colors} = useTheme();
    const {t, language, getLocalized} = useLanguage();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const detailsId = useId();
    const hasMore = listFor(experience, 'highlights', language).length > 0 || experience.tech.length > 0;
    const toggle = () => setOpen((o) => !o);
    // a click anywhere on the row opens or closes it, except on its own buttons and links
    const rowClick = hasMore ? (e) => { if (!e.target.closest('a, button')) toggle(); } : undefined;

    const role = getLocalized(experience, 'role');
    const badge = BADGES[experience.type];
    const dates = `${monthYear(experience.start, language)} – ${experience.end ? monthYear(experience.end, language) : t.present}`;
    const length = duration(experience.start, experience.end, language);

    const badges = (size) => (
        <>
            {experience.is_current && <Badge label={t.now} bg={colors.accent} color={colors.bg} size={size}/>}
            {badge && <Badge label={t[badge.key]} bg={badge.bg} size={size}/>}
        </>
    );

    const roleLine = (fontSize) => (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px'}}>
            <h3 style={{margin: 0, fontSize, fontWeight: 500, color: hovered ? colors.accent : colors.text, transition: 'color 0.15s ease', lineHeight: 1.35}}>
                {role.value}
                <TranslationBadge show={role.needsTranslation}/>
            </h3>
            {hasMore && <DetailsToggle open={open} onToggle={toggle} controls={detailsId}/>}
        </div>
    );
    const more = (rowHovered) => hasMore && (
        <Disclosure id={detailsId} open={open}>
            <More experience={experience} colors={colors} language={language} hovered={rowHovered}/>
        </Disclosure>
    );

    if (isMobile) {
        return (
            <div className="xp-card" onClick={rowClick} style={{padding: '24px 0', borderBottom: `1px solid ${colors.borderLight}`, cursor: hasMore ? 'pointer' : 'default'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: colors.textDark, fontSize: '11px', marginBottom: '8px'}}>
                    <Calendar {...icon} size={12}/>{dates}<span style={{color: colors.textDarker}}>· {length}</span>
                </div>
                {roleLine('16px')}
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap'}}>
                    <span style={{color: colors.textDarker, fontSize: '13px'}}>@</span>
                    <span style={{color: experience.is_current ? colors.textSecondary : colors.textMuted, fontSize: '14px'}}>{experience.company}</span>
                    {badges('10px')}
                </div>
                <Summary experience={experience} colors={colors} language={language}/>
                {more(false)}
            </div>
        );
    }

    return (
        <div
            className="xp-card"
            style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(90px, 18%, 160px) 1fr',
                gap: 'clamp(12px, 3vw, 24px)',
                padding: `${PAD}px 0`,
                borderBottom: `${BORDER}px solid ${colors.borderLight}`,
                transition: 'all 0.2s ease',
                background: hovered ? `linear-gradient(90deg, ${colors.bgHover} 0%, transparent 100%)` : 'transparent',
                cursor: hasMore ? 'pointer' : 'default',
            }}
            onClick={rowClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{position: 'relative'}}>
                {/* icon beside one text column, so the three lines share a left edge */}
                <div style={{display: 'flex', gap: '6px', color: colors.textDark, fontSize: '12px', lineHeight: 1.6}}>
                    <Calendar {...icon} size={12} style={{flexShrink: 0, marginTop: '3px'}}/>
                    <div style={{whiteSpace: 'nowrap'}}>
                        <div>{monthYear(experience.start, language)} –</div>
                        <div>{experience.end ? monthYear(experience.end, language) : t.present}</div>
                        <div style={{color: colors.textDarker, fontSize: '11px', marginTop: '4px'}}>{length}</div>
                    </div>
                </div>

                {!isLast && (
                    <div aria-hidden="true" style={{
                        position: 'absolute',
                        left: '50%',
                        top: `${LINE_TOP}px`,
                        bottom: `-${LINE_BELOW}px`,
                        width: '1px',
                        transform: 'translateX(-50%)',
                        background: colors.borderLight,
                    }}/>
                )}

                {/* one node per role on the line: filled for current roles (with a soft ripple), hollow for past ones */}
                <div aria-hidden="true" style={{
                    position: 'absolute',
                    left: '50%',
                    top: `${NODE_TOP}px`,
                    width: `${NODE}px`,
                    height: `${NODE}px`,
                    transform: 'translateX(-50%)',
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    border: `1px solid ${experience.is_current ? colors.accent : colors.textDarker}`,
                    background: experience.is_current ? colors.accent : colors.bg,
                    zIndex: 1,
                }}>
                    {experience.is_current && <span className="timeline-ripple" style={{borderColor: colors.accent}}/>}
                </div>
            </div>

            <div>
                {roleLine('18px')}
                <div style={{display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px', flexWrap: 'wrap'}}>
                    <span style={{color: colors.textDarker}}>@</span>
                    <span style={{color: experience.is_current ? colors.textSecondary : colors.textMuted, fontSize: '15px'}}>{experience.company}</span>
                    {badges('11px')}
                </div>
                <Summary experience={experience} colors={colors} language={language}/>
                {more(hovered)}
            </div>
        </div>
    );
}
