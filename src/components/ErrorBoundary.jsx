import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '100vh',
                    backgroundColor: '#0a0a0a', color: '#ccc', fontFamily: 'monospace',
                    padding: '24px', textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#fff' }}>
                        Something went wrong
                    </h1>
                    <p style={{ marginBottom: '24px', color: '#888' }}>
                        An unexpected error occurred. Please refresh the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 24px', backgroundColor: '#333',
                            color: '#fff', border: '1px solid #555',
                            borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace'
                        }}
                    >
                        Refresh page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
