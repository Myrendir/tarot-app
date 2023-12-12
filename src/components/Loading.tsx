import React from 'react';
import {ThreeDots} from "react-loader-spinner";

const Loading: React.FC = () => {

    return (
        <ThreeDots height={80}
                   width={80}
                   radius={9}
                   color={'var(--Bleu, #054A81)'}
                   ariaLabel={"three-dots-loading"}
                   wrapperStyle={{
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                       height: '100vh',
                       width: '100vw',
                       position: 'fixed',
                       top: '0',
                       left: '0',
                       backgroundColor: 'rgba(255,255,255,0.9)',
                       zIndex: '1000',
                       color: 'var(--Bleu, #054A81)'
                   }}
                   wrapperClass=""
                   visible={true}/>
    );
};

export default Loading;
