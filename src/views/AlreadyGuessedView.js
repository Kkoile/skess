import React, {useContext} from "react";
import './AlreadyGuessedView.css';
import PrimaryButton from "../components/PrimaryButton";
import {GameContext} from "../contexts/GameContext";
import chosenWordLeft from "../assets/chosenWordLeft.svg";
import chosenWordRight from "../assets/chosenWordRight.svg";
import {useTranslation} from "react-i18next";

export default function AlreadyGuessedView () {
    const {game} = useContext(GameContext);
    const {t} = useTranslation('game');

    return (
        <div className={'AlreadyGuessedView'}>
            <h1>{t('alreadyGuessedTitle')}</h1>
            <div className={'AlreadyGuessedView-guessedWord'}>
                <img src={chosenWordLeft} />
                <PrimaryButton style={{margin: '2rem'}} value={game.currentRound.guess} />
                <img src={chosenWordRight} />
            </div>
            <p>{t('alreadyGuessedWaitingText')}</p>
        </div>
    )
}