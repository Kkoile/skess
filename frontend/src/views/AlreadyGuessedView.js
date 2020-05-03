import React, {useContext} from "react";
import './AlreadyGuessedView.css';
import PrimaryButton from "../components/PrimaryButton";
import {GameContext} from "../contexts/GameContext";
import chosenWordLeft from "../assets/chosenWordLeft.svg";
import chosenWordRight from "../assets/chosenWordRight.svg";
import {useTranslation} from "react-i18next";
import Avatar from "../components/Avatar";

export default function AlreadyGuessedView () {
    const {game, getNameOfPlayer} = useContext(GameContext);
    const {t} = useTranslation('game');

    const renderPlayerToWaitFor = game.waitingForPlayerToSubmit.map(playerId => {
        return (
            <div key={playerId} className={'AlreadyGuessedView-playerItem'}>
                <Avatar value={getNameOfPlayer(playerId)} />
                <h2  className={'AlreadyGuessedView-playerItemName'}>{getNameOfPlayer(playerId)}</h2>
            </div>
        )
    })

    return (
        <div className={'AlreadyGuessedView'}>
            <h1>{t('alreadyGuessedTitle')}</h1>
            <div className={'AlreadyGuessedView-guessedWord'}>
                <img src={chosenWordLeft} />
                <PrimaryButton style={{margin: '2rem'}} value={game.currentRound.guess} />
                <img src={chosenWordRight} />
            </div>
            <p>{t('alreadyGuessedWaitingText')}</p>
            <div className={'AlreadyGuessedView-playerList'}>
                {renderPlayerToWaitFor}
            </div>
        </div>
    )
}