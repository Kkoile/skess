import React, {useState} from 'react';
import './PrimaryButton.css';

export default function PrimaryButton({style = {}, value, onClick, disabled}) {
    const isClickable = !!onClick;
    const [mouseDown, setMouseDown] = useState(false);
    const [hover, setHover] = useState(false);

    const innerStyle = JSON.parse(JSON.stringify(style));
    if (isClickable && !disabled) {
        innerStyle.cursor = 'pointer';
        if (mouseDown) {
            innerStyle.backgroundColor = '#FF9688';
        }
        if (hover) {
            innerStyle.boxShadow = '0px 0px 17px 3px rgba(252,252,252,0.83)';
        }
    }
    if (disabled) {
        innerStyle.backgroundColor = '#809da9'
    }

    return (
        <div
            className={'Primary-Button'}
            style={innerStyle}
            onClick={() => isClickable && !disabled && onClick(value)}
            onMouseLeave={() => setMouseDown(false)}
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        >
            {value}
        </div>
    )
}