import React, {useContext, useState} from 'react';
import {Input} from "antd";
import {GameContext} from "../contexts/GameContext";
import PrimaryButton from "../components/PrimaryButton";
import {useTranslation} from "react-i18next";
import './GuessingRound.css';

export default function GuessingRound() {
    const {game, submitGuess, getNameOfPlayer} = useContext(GameContext);
    const [guess, setGuess] = useState('');
    const {t} = useTranslation('game')

    const {currentRound} = game;

    const onSubmitGuessClicked = () => {
        if (guess.trim().length > 0) {
            submitGuess(guess);
        }
    }

    if (!currentRound) {
        return <div>Waiting for the round...</div>
    }

    return (
        <div className={'GuessingRound'}>
            <div style={{height: '100%', width: '96%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div className={'GuessingRound-header'}>
                    <div className={'GuessingRound-titles'}>
                        <h1>{t('guessingTitle', {userName: getNameOfPlayer(currentRound.previousPlayerId)})}</h1>
                    </div>
                </div>
                <div style={{flex: '1 1 auto', maxWidth: '100%', maxHeight: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '2rem'}}>
                        <Input style={{height: '4rem', fontSize: '1.5rem', border: 'none', borderRadius: '2px 0 0 2px', boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)'}} onPressEnter={onSubmitGuessClicked} value={guess} autoFocus onChange={(event) => setGuess(event.target.value)}/>
                        <PrimaryButton disabled={guess.trim().length === 0} style={{height: '4rem'}} onClick={onSubmitGuessClicked} value={t('submit')} />
                    </div>
                    <img className={'GuessingRound-image'} src={currentRound.image}/>
                </div>
            </div>
        </div>
    );
}
