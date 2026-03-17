import { useState, useEffect } from 'react';

export default function Cursor() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  return <span style={{ opacity: visible ? 1 : 0 }}>█</span>;
}
