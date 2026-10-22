import {useState, useId} from 'react';
import {MapPin} from 'lucide-react';
import {useTheme} from '@context/ThemeContext';
import {useLanguage} from '@context/LanguageContext';
import {TranslationBadge} from '@components/ui';
import {Disclosure} from '@components/ui/Disclosure';
import {monthYear} from '../../data/dates.js';

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

export default function ExperienceCard({experience}) {
    const [hovered, setHovered] = useState(false);
    const {colors} = useTheme();
    const {t, language, getLocalized} = useLanguage();
    const [open, setOpen] = useState(false);
    const detailsId = useId();
    const hasMore = listFor(experience, 'highlights', language).length > 0 || experience.tech.length > 0;
    const toggle = () => setOpen((o) => !o);
    // a click anywhere on the row opens or closes it, except on its own buttons and links
    const rowClick = hasMore ? (e) => { if (!e.target.closest('a, button')) toggle(); } : undefined;

    const role = getLocalized(experience, 'role');
    const badge = BADGES[experience.type];
    const dates = `${monthYear(experience.start, language)} – ${experience.end ? monthYear(experience.end, language) : t.present}`;

    return (
        <div
            className="xp-card"
            onClick={rowClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '22px 0',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
                background: hovered ? `linear-gradient(90deg, ${colors.bgHover} 0%, transparent 100%)` : 'transparent',
                // the highlight starts a little left of the text, without moving the text or the separators
                boxShadow: hovered ? `-16px 0 0 0 ${colors.bgHover}` : 'none',
                cursor: hasMore ? 'pointer' : 'default',
            }}
        >
            {/* when the role is too long to share the line, the dates wrap below it, still on the right */}
            <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 16px'}}>
                <h3 style={{flex: '1 1 260px', margin: 0, fontSize: '18px', fontWeight: 500, color: hovered ? colors.accent : colors.text, transition: 'color 0.15s ease', lineHeight: 1.35}}>
                    {/* the role is the toggle for keyboards and screen readers; a mouse can click anywhere on the row */}
                    {hasMore
                        ? <button type="button" aria-expanded={open} aria-controls={detailsId} onClick={toggle}
                                  style={{background: 'none', border: 0, padding: 0, font: 'inherit', color: 'inherit', textAlign: 'left', cursor: 'pointer'}}>
                            {role.value}
                          </button>
                        : role.value}
                    <TranslationBadge show={role.needsTranslation}/>
                </h3>
                <span style={{marginLeft: 'auto', color: colors.textDarker, fontSize: '13px', whiteSpace: 'nowrap'}}>{dates}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px', flexWrap: 'wrap'}}>
                <span style={{color: colors.textDarker}}>@</span>
                <span style={{color: experience.is_current ? colors.textSecondary : colors.textMuted, fontSize: '15px'}}>{experience.company}</span>
                {experience.is_current && <Badge label={t.now} bg={colors.accent} color={colors.bg} size="11px"/>}
                {badge && <Badge label={t[badge.key]} bg={badge.bg} size="11px"/>}
            </div>
            <Summary experience={experience} colors={colors} language={language}/>
            {hasMore && (
                <Disclosure id={detailsId} open={open}>
                    <More experience={experience} colors={colors} language={language} hovered={hovered}/>
                </Disclosure>
            )}
        </div>
    );
}
