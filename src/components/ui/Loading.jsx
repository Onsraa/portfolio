import { useTheme } from '@context/ThemeContext';

export default function Loading({ message = 'Loading...' }) {
  const { colors } = useTheme();

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        color: colors.textDark,
      }}
    >
      <div style={{
        fontSize: '24px',
        marginBottom: '16px',
        animation: 'spin 1s linear infinite',
      }}>
        ⟳
      </div>
      <p style={{ margin: 0, fontSize: '14px' }}>{message}</p>
    </div>
  );
}
