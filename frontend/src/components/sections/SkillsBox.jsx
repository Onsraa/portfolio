export default function SkillsBox({ skills }) {
  const categories = Object.entries(skills);

  if (categories.length === 0) return null;

  return (
    <div style={{
      marginTop: '48px',
      padding: '24px',
      border: '1px solid #1a1a1a',
      background: '#0d0d0d'
    }}>
      <div style={{
        fontSize: '12px',
        color: '#444',
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        $ cat skills.txt
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        {categories.map(([category, items]) => (
          <div key={category}>
            <div style={{
              color: '#555',
              fontSize: '11px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {category}
            </div>
            <div style={{ color: '#888', fontSize: '14px', lineHeight: 1.8 }}>
              {Array.isArray(items) ? items.join(', ') : items}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
