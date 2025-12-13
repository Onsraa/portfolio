import { useState, useEffect } from 'react';

function TypedText({ text, delay = 0 }) {
    const [displayed, setDisplayed] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        if (displayed.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayed(text.slice(0, displayed.length + 1));
            }, 25);
            return () => clearTimeout(timeout);
        }
    }, [displayed, text, started]);

    return <span>{displayed}</span>;
}

export default TypedText;