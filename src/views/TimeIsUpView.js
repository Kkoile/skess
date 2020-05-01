import React from "react";
import lineDrawingImage from "../assets/lineDrawing.svg";
import './TimeIsUpView.css';
import {useTranslation} from "react-i18next";

export default function TimeIsUpView () {
    const {t} = useTranslation('game');
    return (
        <div className={'TimeIsUpView'}>
            <h1 className={'title'}>{t('timeIsUpTitle')}</h1>
            <h2 className={'subtitle'}>{t('timeIsUpWaitingText')}</h2>
            <img src={lineDrawingImage} style={{minWidth: '20rem', width: '40%'}}/>
        </div>
    )
}