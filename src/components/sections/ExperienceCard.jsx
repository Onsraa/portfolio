import {useState, useEffect} from 'react';
import {Calendar, Laptop, MapPin, Trophy} from 'lucide-react';
import {useTheme} from '@context/ThemeContext';
import {useLanguage} from '@context/LanguageContext';
import {TranslationBadge} from '@components/ui';
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

const icon = {size: 13, strokeWidth: 1.8, 'aria-hidden': true, style: {flexShrink: 0}};

function Badge({label, bg, color = '#f7f7f7', size}) {
    return (
        <span style={{padding: '2px 8px', fontSize: size, color, background: bg, letterSpacing: '0.05em', whiteSpace: 'nowrap'}}>
            {label}
        </span>
    );
}

// Everything under the role line: place and mode, summary, highlights, achievements, tech.
function Details({experience, colors, t, language, hovered}) {
    const list = (field) => experience[`${field}_${language}`]?.length ? experience[`${field}_${language}`] : experience[`${field}_en`] || [];
    const highlights = list('highlights');
    const achievements = list('achievements');
    const description = experience[`description_${language}`] || experience.description_en;
    const meta = {display: 'inline-flex', alignItems: 'center', gap: '6px'};

    return (
        <>
            {(experience.location || experience.mode) && (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginTop: '10px', fontSize: '12px', color: colors.textMuted}}>
                    {experience.location && <span style={meta}><MapPin {...icon}/>{experience.location}</span>}
                    {experience.mode && <span style={meta}><Laptop {...icon}/>{t[experience.mode]}</span>}
                </div>
            )}

            {description && (
                <p style={{margin: '14px 0 0 0', color: colors.textSecondary, fontSize: '14px', lineHeight: 1.7, maxWidth: '640px'}}>
                    {description}
                </p>
            )}

            {highlights.length > 0 && (
                <ul style={{listStyle: 'none', margin: '12px 0 0 0', padding: 0, maxWidth: '640px'}}>
                    {highlights.map((h, i) => (
                        <li key={i} style={{display: 'flex', gap: '10px', color: colors.textDark, fontSize: '13px', lineHeight: 1.7, marginBottom: '6px'}}>
                            <span style={{color: colors.textDarker, flexShrink: 0}}>→</span>{h}
                        </li>
                    ))}
                </ul>
            )}

            {achievements.length > 0 && (
                <div style={{margin: '14px 0 0 0', padding: '12px 14px', maxWidth: '640px', border: `1px solid ${colors.borderLight}`, background: colors.bgHover}}>
                    <div style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.textMuted, marginBottom: '8px'}}>
                        {t.achievements}
                    </div>
                    {achievements.map((a, i) => (
                        <div key={i} style={{display: 'flex', gap: '10px', color: colors.text, fontSize: '13px', lineHeight: 1.7}}>
                            <Trophy {...icon} size={14} style={{flexShrink: 0, marginTop: '4px', color: colors.accent}}/>{a}
                        </div>
                    ))}
                </div>
            )}

            {experience.tech.length > 0 && (
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px'}}>
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
        </>
    );
}

export default function ExperienceCard({experience, isLast}) {
    const [hovered, setHovered] = useState(false);
    const {colors} = useTheme();
    const {t, language, getLocalized} = useLanguage();
    const isMobile = useIsMobile();

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
        <h3 style={{margin: 0, fontSize, fontWeight: 500, color: hovered ? colors.accent : colors.text, transition: 'color 0.15s ease', lineHeight: 1.35}}>
            {role.value}
            <TranslationBadge show={role.needsTranslation}/>
        </h3>
    );

    if (isMobile) {
        return (
            <div className="xp-card" style={{padding: '24px 0', borderBottom: `1px solid ${colors.borderLight}`}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: colors.textDark, fontSize: '11px', marginBottom: '8px'}}>
                    <Calendar {...icon} size={12}/>{dates}<span style={{color: colors.textDarker}}>· {length}</span>
                </div>
                {roleLine('16px')}
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap'}}>
                    <span style={{color: colors.textDarker, fontSize: '13px'}}>@</span>
                    <span style={{color: experience.is_current ? colors.textSecondary : colors.textMuted, fontSize: '14px'}}>{experience.company}</span>
                    {badges('10px')}
                </div>
                <Details experience={experience} colors={colors} t={t} language={language} hovered={false}/>
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
                padding: '32px 0',
                borderBottom: `1px solid ${colors.borderLight}`,
                transition: 'all 0.2s ease',
                background: hovered ? `linear-gradient(90deg, ${colors.bgHover} 0%, transparent 100%)` : 'transparent',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{position: 'relative'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: colors.textDark, fontSize: '12px', whiteSpace: 'nowrap'}}>
                    <Calendar {...icon} size={12}/>{dates.split(' – ')[0]}
                </div>
                <div style={{color: colors.textDark, fontSize: '12px', paddingLeft: '18px', whiteSpace: 'nowrap'}}>– {dates.split(' – ')[1]}</div>
                <div style={{color: colors.textDarker, fontSize: '11px', paddingLeft: '18px', marginTop: '4px'}}>{length}</div>

                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '76px',
                    bottom: '-32px',
                    width: '1px',
                    background: colors.borderLight,
                    display: isLast ? 'none' : 'block'
                }}/>

                {experience.is_current && (
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '80px',
                        transform: 'translateX(-50%)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: colors.accent,
                        boxShadow: `0 0 12px ${colors.accent}40`,
                        animation: 'pulse 2s ease-in-out infinite'
                    }}/>
                )}
            </div>

            <div>
                {roleLine('18px')}
                <div style={{display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px', flexWrap: 'wrap'}}>
                    <span style={{color: colors.textDarker}}>@</span>
                    <span style={{color: experience.is_current ? colors.textSecondary : colors.textMuted, fontSize: '15px'}}>{experience.company}</span>
                    {badges('11px')}
                </div>
                <Details experience={experience} colors={colors} t={t} language={language} hovered={hovered}/>
            </div>
        </div>
    );
}
