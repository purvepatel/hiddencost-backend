import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '120px',
            fontWeight: '800',
            color: 'var(--text-muted)',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
