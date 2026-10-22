import { ChevronDown } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';

// A region that opens and closes with a height transition (grid rows 0fr → 1fr, see .disclosure in index.css).
export function Disclosure({ id, open, children }) {
    return (
        // inert while closed: hidden links can't be tabbed to or read out (React 18 passes it as a plain attribute)
        <div id={id} className="disclosure" data-open={open} aria-hidden={!open} inert={open ? undefined : ''}>
            <div>{children}</div>
        </div>
    );
}

// The small "details ⌄" button that controls a Disclosure.
export function DetailsToggle({ open, onToggle, controls }) {
    const { colors } = useTheme();
    const { t } = useLanguage();
    return (
        <button
            type="button"
            className="details-toggle"
            aria-expanded={open}
            aria-controls={controls}
            aria-label={open ? t.hideDetails : t.showDetails}
            onClick={onToggle}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0,
                background: open ? colors.bgHover : 'none', border: `1px solid ${colors.borderLight}`,
                padding: '2px 8px', color: open ? colors.text : colors.textMuted,
                font: 'inherit', fontSize: '11px', cursor: 'pointer',
            }}
        >
            {t.details}<ChevronDown size={13} strokeWidth={1.8} aria-hidden="true" />
        </button>
    );
}
