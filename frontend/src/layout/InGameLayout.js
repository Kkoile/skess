import React from 'react';
import './InGameLayout.css';

export default function ({children}) {

    return (
        <div className={'InGameLayout-main'}>
            <div className={'InGameLayout-content'}>
                {children}
            </div>
        </div>
    );
}