export default function Footer({ siteName }) {
  return (
    <footer style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 24px 80px',
      borderTop: '1px solid #1a1a1a',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <span style={{ color: '#333', fontSize: '13px' }}>
        © {new Date().getFullYear()} · {siteName || 'Portfolio'}
      </span>
      <span style={{ color: '#333', fontSize: '13px' }}>
        <span style={{ color: '#444' }}>last login:</span> {new Date().toLocaleDateString('fr-FR')}
      </span>
    </footer>
  );
}
