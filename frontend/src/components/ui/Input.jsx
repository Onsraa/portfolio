import { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
  style = {},
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: focused ? '#111' : '#0d0d0d',
    border: `1px solid ${error ? '#662222' : focused ? '#444' : '#222'}`,
    color: disabled ? '#555' : '#e0e0e0',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.15s ease',
    resize: multiline ? 'vertical' : 'none',
    ...style,
  };

  const Component = multiline ? 'textarea' : 'input';

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#666',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          <span style={{ color: '#444' }}>$</span> {label}
          {required && <span style={{ color: '#aa4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <Component
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={multiline ? rows : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
        {...props}
      />
      {error && (
        <p style={{
          margin: '8px 0 0 0',
          color: '#aa4444',
          fontSize: '12px',
        }}>
          <span style={{ marginRight: '6px' }}>✗</span>
          {error}
        </p>
      )}
    </div>
  );
}
