import React, {useContext, useEffect, useState} from 'react';
import {Input} from "antd";
import {GameContext} from "../contexts/GameContext";
import PrimaryButton from "../components/PrimaryButton";

export default function GuessingRound() {
    const {game, submitGuess, getNameOfPlayer} = useContext(GameContext);
    const [guess, setGuess] = useState('');

    const {currentRound} = game;

    const onSubmitGuessClicked = () => {
        submitGuess(guess);
    }

    if (!currentRound) {
        return <div>Waiting for the round...</div>
    }

    return (
        <div className={'GameBoard'}>
            <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div className={'GameBoard-header'}>
                    <div className={'GameBoard-titles'}>
                        <h1>Now guess what <u>{getNameOfPlayer(currentRound.previousPlayerId)}</u> drew</h1>
                    </div>
                </div>
                <div style={{flex: '1 1 auto', maxWidth: '100%', maxHeight: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '2rem'}}>
                        <Input style={{height: '4rem', border: 'none', borderRadius: '2px 0 0 2px', boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)'}} onPressEnter={onSubmitGuessClicked} value={guess} autoFocus onChange={(event) => setGuess(event.target.value)}/>
                        <PrimaryButton style={{height: '4rem'}} onClick={onSubmitGuessClicked} value={'Submit'} />
                    </div>
                    <img style={{maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto'}} width={'auto'} height={'auto'} src={currentRound.image}/>
                </div>
            </div>
        </div>
    );
}
