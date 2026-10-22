import { useTheme } from '@context/ThemeContext';

// A section title written as a shell command, e.g. "$ ls experience/", with its count on the right.
export default function SectionHeader({ title, count }) {
    const { colors } = useTheme();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '4px 16px',
            marginBottom: '12px',
        }}>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 400, color: colors.text }}>
                <span style={{ color: colors.textDarkest }}>$ ls </span>{title}
            </h2>
            {count && (
                <span style={{ color: colors.textDarkest, fontSize: '12px' }}>
                    {count}
                </span>
            )}
        </div>
    );
}
