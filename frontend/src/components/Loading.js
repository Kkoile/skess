import React from 'react';
import './Loading.css';

export default function Loading ({color = '#fff'}) {
    return (
        <div className="lds-ring">
            <div style={{borderColor: `${color} transparent transparent transparent`}}></div>
            <div style={{borderColor: `${color} transparent transparent transparent`}}></div>
            <div style={{borderColor: `${color} transparent transparent transparent`}}></div>
            <div style={{borderColor: `${color} transparent transparent transparent`}}></div>
        </div>
    )
}