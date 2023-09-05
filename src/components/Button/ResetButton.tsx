import React from 'react';
const ResetButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    const style: React.CSSProperties = {
        position: 'fixed',
        bottom: '105px',
        right: '15px',
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e14c5b',
        color: 'white',
        border: 'none',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 1000,
    };

    return (
        <button style={style} onClick={onClick}>
            <i className={'fas fa-trash'}></i>
        </button>
    );
};

export default ResetButton;
