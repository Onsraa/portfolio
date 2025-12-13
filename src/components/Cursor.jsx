import { useState, useEffect } from 'react';

function Cursor() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => setVisible(v => !v), 530);
        return () => clearInterval(interval);
    }, []);

    return <span className="cursor" style={{ opacity: visible ? 1 : 0 }}>█</span>;
}

export default Cursor;