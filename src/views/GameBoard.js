import React, {useEffect, useState} from 'react';
import './GameBoard.css';
import DrawingBoard from "./DrawingBoard";
import { ClockCircleOutlined } from '@ant-design/icons';
import {Button, Input} from "antd";

export default function GameBoard({timeToDraw, round, onDrawingEnded, submitGuess}) {
    const [countdown, setCountdown] = useState(timeToDraw);
    const [image, setImage] = useState(null);
    const [guess, setGuess] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (round && round.drawing && countdown < 1) {
            const intervalId = setInterval(() => {
                onDrawingEnded(image);
            }, 2000);
            return () => {
                clearInterval(intervalId);
            }
        }
    }, [round, countdown, image, onDrawingEnded]);

    useEffect(() => {
        setGuess('');
        if (round && round.drawing) {
            setCountdown(timeToDraw)
            const intervalId = setInterval(() => {
                setCountdown(currentNumber => currentNumber > 0 ? currentNumber - 1 : 0);
            }, 1000);
            return () => {
                clearInterval(intervalId);
            }
        }
    }, [round, timeToDraw]);

    const onSubmitGuessClicked = () => {
        setSubmitted(true);
        submitGuess(guess);
    }

    if (!round) {
        return <div>Waiting for the round...</div>
    }

    return (
        <div className={'GameBoard'}>
            {round.drawing && countdown > 0 && (
                <div>
                    <div className={'GameBoard-header'}>
                        <div className={'GameBoard-countdown'}>
                            <ClockCircleOutlined style={{fontSize: '32px'}}/>
                            {countdown}
                        </div>
                        <div className={'GameBoard-titles'}>
                            <h2>Draw the following word</h2>
                            <h1>{round.word}</h1>
                            {round.playerBefore && (
                                <h2>{round.playerBefore.name} guessed this word</h2>
                            )}
                        </div>
                    </div>
                    <DrawingBoard onDrawBoardChanged={setImage}/>
                </div>
            )}
            {round.drawing && countdown < 1 && (
                <div>
                    <div className={'GameBoard-header'}>
                        <h1>Time is up!</h1>
                        <h2>Waiting for everyone to submit their image...</h2>
                    </div>
                </div>
            )}
            {round.guessing && (
                <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div className={'GameBoard-header'}>
                        <div className={'GameBoard-titles'}>
                            <h1>Now guess what {round.playerBefore.name} drew</h1>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '1rem'}}>
                                <Input style={{height: '4rem'}} onPressEnter={onSubmitGuessClicked} value={guess} autoFocus onChange={(event) => setGuess(event.target.value)}/>
                                <Button style={{marginLeft: '1rem', height: '4rem'}} type={'primary'} onClick={onSubmitGuessClicked}>Submit</Button>
                            </div>
                            {isSubmitted &&
                                <h2>Waiting till everyone submitted their guess. You can still change yours if you like.</h2>
                            }
                        </div>
                    </div>
                    <div style={{flex: '1 1 auto', maxWidth: '100%', maxHeight: '100%', borderStyle: 'solid', borderWidth: 1}}>
                        <img style={{maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto'}} width={'auto'} height={'auto'} src={round.image}/>
                    </div>
                </div>
            )}
        </div>
    );
}
