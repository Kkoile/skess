import React, {useContext, useEffect, useState} from 'react';
import './DrawingRound.css';
import DrawingBoard from "./DrawingBoard";
import {GameContext} from "../contexts/GameContext";
import PrimaryButton from "../components/PrimaryButton";
import TimeIsUpView from "./TimeIsUpView";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {useTranslation} from "react-i18next";

export default function DrawingRound() {
    const {game, submitImage, getNameOfPlayer} = useContext(GameContext);
    const [countdown, setCountdown] = useState(game.options.timeToDraw);
    const [image, setImage] = useState(null);
    const {t} = useTranslation('game');

    const {currentRound, options} = game;

    useEffect(() => {
        if (currentRound && countdown < 1) {
            submitImage(image);
        }
    }, [currentRound, countdown, image, submitImage]);

    useEffect(() => {
        if (currentRound && currentRound.drawing) {
            setCountdown(options.timeToDraw);
            const intervalId = setInterval(() => {
                setCountdown(currentNumber => currentNumber > 0 ? currentNumber - 1 : 0);
            }, 1000);
            return () => {
                clearInterval(intervalId);
            }
        }
    }, [currentRound, options.timeToDraw]);

    if (!currentRound) {
        return <div>Waiting for the round...</div>
    }

    if (currentRound.submitted || countdown <= 0) {
        return <TimeIsUpView/>
    }

    return (
        <div className={'DrawingRound'}>
            <div>
                <div className={'DrawingRound-header'}>
                    <div className={'DrawingRound-countdown'}>
                        <CircularProgressbar
                            value={countdown}
                            text={countdown}
                            maxValue={options.timeToDraw}
                            counterClockwise
                            styles={buildStyles({
                                pathColor: countdown <= 10 ? 'red' : 'black',
                                trailColor: 'white',
                                textColor: countdown <= 10 ? 'red' : 'black',
                                textSize: '2rem'
                            })}
                        />
                    </div>
                    <div className={'DrawingRound-titles'}>
                        <h1 style={{margin: 0}}>{t('drawingTitle')}</h1>
                        <PrimaryButton style={{marginBottom: '2rem'}} value={currentRound.word}/>
                        {currentRound.previousPlayerId && (
                            <h2>{t('drawingRoundGuessOfPlayer', {userName: getNameOfPlayer(currentRound.previousPlayerId)})}</h2>
                        )}
                    </div>
                </div>
                <DrawingBoard onDrawBoardChanged={setImage}/>
            </div>
        </div>
    );
}
