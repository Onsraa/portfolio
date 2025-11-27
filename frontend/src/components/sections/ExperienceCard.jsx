import { useState } from 'react';

export default function ExperienceCard({ experience, isLast = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(100px, 20%, 160px) 1fr',
        gap: '24px',
        padding: '32px 0',
        borderBottom: '1px solid #222',
        transition: 'all 0.2s ease',
        background: hovered ? 'linear-gradient(90deg, #111 0%, transparent 100%)' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative' }}>
        <span style={{
          color: '#555',
          fontSize: '13px',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap'
        }}>
          {experience.period}
        </span>

        <div style={{
          position: 'absolute',
          left: '50%',
          top: '28px',
          bottom: '-32px',
          width: '1px',
          background: '#222',
          display: isLast ? 'none' : 'block'
        }} />

        {experience.is_current && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '32px',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 0 12px rgba(255,255,255,0.5)',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
        )}
      </div>

      <div>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '17px',
            fontWeight: 400,
            color: hovered ? '#fff' : '#ccc',
            transition: 'color 0.15s ease'
          }}>
            {experience.role}
          </h3>
          <span style={{ color: '#444' }}>@</span>
          <span style={{
            color: experience.is_current ? '#888' : '#666',
            fontSize: '15px',
          }}>
            {experience.company}
            {experience.is_current && (
              <span style={{
                marginLeft: '18px',
                padding: '2px 8px',
                fontSize: '11px',
                color: '#333',
                background: '#fff',
                letterSpacing: '0.05em'
              }}>
                NOW
              </span>
            )}
          </span>
          {experience.is_internship && (
            <span style={{
              padding: '2px 8px',
              fontSize: '11px',
              color: '#f7f7f7',
              background: '#3858c9',
              letterSpacing: '0.05em'
            }}>
              INTERNSHIP
            </span>
          )}
        </div>

        <p style={{
          margin: '12px 0 16px 0',
          color: '#777',
          fontSize: '14px',
          lineHeight: 1.7,
          maxWidth: '600px'
        }}>
          {experience.description}
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {experience.tech?.map((t, i) => (
            <span
              key={i}
              style={{
                color: '#555',
                fontSize: '12px',
                padding: '3px 10px',
                border: '1px solid #2a2a2a',
                background: hovered ? '#1a1a1a' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
