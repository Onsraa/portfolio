export default function SectionHeader({ title, count }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '16px',
      paddingBottom: '16px',
      borderBottom: '1px solid #1a1a1a'
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
        <span style={{ color: '#333', fontSize: '13px' }}>$</span>
        <h2 style={{
          margin: 0,
          fontSize: '13px',
          fontWeight: 400,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          {title}
        </h2>
      </div>
      {count && (
        <span style={{ color: '#333', fontSize: '12px' }}>
          {count}
        </span>
      )}
    </div>
  );
}
