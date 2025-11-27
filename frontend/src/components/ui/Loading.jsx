export default function Loading({ message = 'Chargement...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      color: '#555',
    }}>
      <div style={{
        fontSize: '24px',
        marginBottom: '16px',
        animation: 'spin 1s linear infinite',
      }}>
        ⟳
      </div>
      <p style={{ margin: 0, fontSize: '14px' }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
