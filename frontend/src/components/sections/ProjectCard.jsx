import { useState } from 'react';

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        padding: '24px 0',
        borderBottom: '1px solid #222',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.15s ease',
        background: hovered ? '#111' : 'transparent',
        marginLeft: hovered ? '8px' : '0',
        paddingLeft: hovered ? '16px' : '0',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <span style={{
            color: '#444',
            fontFamily: 'inherit',
            fontSize: '14px'
          }}>
            {project.project_id}
          </span>
          <h3 style={{
            margin: 0,
            fontSize: '17px',
            fontWeight: 400,
            color: hovered ? '#fff' : '#ccc',
            transition: 'color 0.15s ease'
          }}>
            {hovered && <span style={{ color: '#555' }}>./</span>}
            {project.title}
          </h3>
        </div>
        <span style={{ color: '#444', fontSize: '13px' }}>
          {project.year}
        </span>
      </div>

      <p style={{
        margin: '0 0 16px 0',
        color: '#777',
        fontSize: '14px',
        lineHeight: 1.7,
        maxWidth: '640px'
      }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {project.tech?.map((t, i) => (
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
    </a>
  );
}
