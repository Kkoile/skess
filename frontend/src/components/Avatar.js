import React from 'react';

export default function Avatar({value, style={}, size='4rem', fontSize='3rem'}) {
    const innerStyle = JSON.parse(JSON.stringify(style));
    innerStyle.width = size;
    innerStyle.height = size;
    innerStyle.borderRadius = size;
    innerStyle.backgroundColor = '#5fd2ec';
    innerStyle.display = 'flex';
    innerStyle.flexDirection = 'column';
    innerStyle.justifyContent = 'center';
    innerStyle.alignItems = 'center';

    return (
        <div style={innerStyle}>
            <h1 style={{margin: 0, fontSize}}>{value[0]}</h1>
        </div>
    )
}