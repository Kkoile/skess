import React, {useContext} from "react";
import './AlreadyGuessedView.css';
import PrimaryButton from "../components/PrimaryButton";
import {GameContext} from "../contexts/GameContext";
import chosenWordLeft from "../assets/chosenWordLeft.svg";
import chosenWordRight from "../assets/chosenWordRight.svg";

export default function AlreadyGuessedView () {
    const {game} = useContext(GameContext);

    return (
        <div className={'AlreadyGuessedView'}>
            <h1>You Guessed</h1>
            <div className={'AlreadyGuessedView-guessedWord'}>
                <img src={chosenWordLeft} />
                <PrimaryButton style={{margin: '2rem'}} value={game.currentRound.guess} />
                <img src={chosenWordRight} />
            </div>
            <p>Waiting for others to guess</p>
        </div>
    )
}