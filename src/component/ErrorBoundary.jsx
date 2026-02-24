import React from 'react';

const crashStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    textAlign: 'center',
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <div style={crashStyle}>
                    <div>
                        <h2 style={{ marginBottom: '8px' }}>Something went wrong</h2>
                        <p style={{ marginBottom: '16px', opacity: 0.9 }}>
                            The app hit an unexpected error. Reload to continue.
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }

        return children;
    }
}

export default ErrorBoundary;
