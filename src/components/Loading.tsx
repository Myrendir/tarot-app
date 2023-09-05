import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const Loading: React.FC = () => {
    const style: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 1000,
        color: '#007bff'
    };

    const iconStyle: React.CSSProperties = {
        fontSize: '2rem',
        animation: 'spin 1s linear infinite'
    };

    return (
        <div style={style}>
            <FontAwesomeIcon icon={faCircleNotch} style={iconStyle} />
        </div>
    );
};

export default Loading;
