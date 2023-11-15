import React from 'react';
import {CSSProperties} from 'react';

const styles: { button: CSSProperties } = {
    button: {
        position: 'fixed',
        bottom: '155px',
        right: '15px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--Bleu, #054A81)',
        color: 'white',
        border: 'none',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
    }
};

interface SaveButtonProps {
    onClick: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({onClick}) => {
    return (
        <button
            onClick={onClick}
            style={styles.button}
            className="btn"
        >
            <i className="fas fa-save"></i>
        </button>
    );
}


export default SaveButton;
