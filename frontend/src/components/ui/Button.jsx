import { useState } from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'default', 
  disabled = false,
  loading = false,
  type = 'button',
  style = {},
  ...props 
}) {
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    background: 'none',
    border: '1px solid #333',
    padding: '10px 20px',
    color: disabled ? '#444' : '#888',
    fontSize: '13px',
    fontFamily: 'inherit',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled || loading ? 0.5 : 1,
  };

  const variants = {
    default: {
      ...baseStyle,
      borderColor: hovered && !disabled ? '#555' : '#333',
      color: hovered && !disabled ? '#fff' : '#888',
      background: hovered && !disabled ? '#1a1a1a' : 'transparent',
    },
    primary: {
      ...baseStyle,
      borderColor: hovered && !disabled ? '#fff' : '#666',
      color: hovered && !disabled ? '#000' : '#fff',
      background: hovered && !disabled ? '#fff' : 'transparent',
    },
    danger: {
      ...baseStyle,
      borderColor: hovered && !disabled ? '#ff4444' : '#662222',
      color: hovered && !disabled ? '#fff' : '#aa4444',
      background: hovered && !disabled ? '#662222' : 'transparent',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...variants[variant], ...style }}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="loading-spinner">⟳</span>
          Chargement...
        </span>
      ) : children}
    </button>
  );
}
