import React from "react";
import lineDrawingImage from "../assets/lineDrawing.svg";
import './TimeIsUpView.css';

export default function TimeIsUpView () {
    return (
        <div className={'TimeIsUpView'}>
            <h1 className={'title'}>Time is up!</h1>
            <h2 className={'subtitle'}>Waiting for the others to submit their drawing</h2>
            <img src={lineDrawingImage} style={{minWidth: '20rem', width: '40%'}}/>
        </div>
    )
}