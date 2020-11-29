import React, {useContext, useEffect, useRef, useState} from 'react';
import './DrawingRound.css';
import DrawingBoard from "./DrawingBoard";
import {GameContext} from "../contexts/GameContext";
import PrimaryButton from "../components/PrimaryButton";
import TimeIsUpView from "./TimeIsUpView";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {useTranslation} from "react-i18next";
import {useSpring, animated} from 'react-spring'
import {FaUndo} from "react-icons/fa";

const OVERLAY_DURATION = 4;

export default function DrawingRound() {
    const {game, submitImage, getNameOfPlayer} = useContext(GameContext);
    const [countdown, setCountdown] = useState(game.options.timeToDraw);
    const {t} = useTranslation('game');
    const drawingBoard = useRef();
    const [zoomWord, setZoomWord] = useState(true);
    const wordTransition = useSpring({
        config: {
            mass: 1,
            tension: 500,
            friction: 80
        },
        from: {
            opacity: 1
        },
        to: async next => {
            if (zoomWord) {
                await next({
                    opacity: 1
                })
            } else {
                await next({
                    opacity: 0
                })
                await next({
                    display: 'none'
                })
            }
        }
    });

    const {currentRound, options} = game;

    const submit = () => {
        const image = drawingBoard.current.getFinalImage();
        submitImage(image);
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setZoomWord(false);
        }, OVERLAY_DURATION * 1000)
        return () => {
            clearTimeout(timeoutId);
        }
    }, []);

    useEffect(() => {
        if (currentRound && !currentRound.submitted && countdown < 1) {
            submit();
        }
    }, [currentRound, countdown, submitImage]);

    useEffect(() => {
        if (currentRound && currentRound.drawing) {
            setCountdown(options.timeToDraw + OVERLAY_DURATION);
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

    if (currentRound.submitted) {
        return <TimeIsUpView/>
    }

    return (
        <div className={'DrawingRound'}>
            <div className={'DrawingRound-header'}>
                <div className={'DrawingRound-titles'}>
                    <h1 style={{margin: 0}}>{t('drawingTitle')}</h1>
                </div>
                <div className={'DrawingRound-headerBottom'}>
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
                    <PrimaryButton swtyle={{marginBottom: '1rem'}} value={currentRound.word}/>
                    {currentRound.previousPlayerId && (
                        <h2>{t('drawingRoundGuessOfPlayer', {userName: getNameOfPlayer(currentRound.previousPlayerId)})}</h2>
                    )}
                    <div className={'DrawingRound-undo'} onClick={() => drawingBoard.current.undo()}>
                        <FaUndo color={'black'} size={'2rem'}/>
                    </div>
                </div>
            </div>
            <DrawingBoard ref={drawingBoard}/>
            <PrimaryButton style={{fontSize: '1rem', marginTop: '1rem', padding: '0.5rem 1rem'}} value={t('submitEarly')} onClick={submit}/>
            <animated.div style={wordTransition} className={'DrawingRound-wordAnimated'} >
                <div className={'overlay'} />
                <h2>{t('drawingTitle')}</h2>
                <PrimaryButton style={{fontSize: '3rem'}} value={currentRound.word}/>
            </animated.div>
        </div>
    );
}
