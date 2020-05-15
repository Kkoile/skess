import React, {useContext, useState} from 'react';
import {GameContext} from "../contexts/GameContext";
import './WordChooser.css';
import PrimaryButton from "../components/PrimaryButton";
import chosenWordLeft from '../assets/chosenWordLeft.svg';
import chosenWordRight from '../assets/chosenWordRight.svg';
import {useTranslation} from "react-i18next";
import Avatar from "../components/Avatar";
import {Input} from "antd";

export default function WordChooser () {

    const {game, chooseWord, getNameOfPlayer} = useContext(GameContext);
    const [selectedWord, setSelectedWord] = useState(game.chosenWord);
    const [customWord, setCustomWord] = useState('');
    const {t} = useTranslation('game');

    const renderWordsToChoose = game.wordsToChoose.map((word, i) => {
        return <PrimaryButton style={{margin: '0 1rem'}} key={i} onClick={() => onWordClicked(word)} value={word}/>
    });

    const onWordClicked = (word) => {
        if (word.trim().length > 0) {
            setSelectedWord(word);
            setTimeout(() => {
                chooseWord(word);
            }, 1000);
        }
    };

    if (game.chosenWord || selectedWord) {
        const renderPlayerToWaitFor = game.waitingForPlayerToSubmit.map(playerId => {
            return (
                <div key={playerId} className={'WordChooser-playerItem'}>
                    <Avatar value={getNameOfPlayer(playerId)} />
                    <h2  className={'WordChooser-playerItemName'}>{getNameOfPlayer(playerId)}</h2>
                </div>
            )
        })
        return (
            <div className={'WordChooser'}>
                <h1>{t('chosenWordTitle')}</h1>
                <div className={'WordChooser-chosenWord'}>
                    <img src={chosenWordLeft} />
                    <PrimaryButton style={{margin: '2rem'}} value={selectedWord} />
                    <img src={chosenWordRight} />
                </div>
                {game.player.length % 2 === 1 && <p>{t('oddNumberOfPlayersChosenInfoText')}</p>}
                <p>{t('waitingForPlayerTitle')}</p>
                <div className={'WordChooser-playerList'}>
                    {renderPlayerToWaitFor}
                </div>
            </div>
        )
    }
    return (
        <div className={'WordChooser'}>
            <h1 style={{marginBottom: 0}}>{t('chooseWordTitle')}</h1>
            {game.player.length % 2 === 0 && <h2 style={{marginBottom: '2rem'}}>{t('evenNumberOfPlayersInfoText')}</h2>}
            {game.player.length % 2 === 1 && <h2 style={{marginBottom: '2rem'}}>{t('oddNumberOfPlayersInfoText')}</h2>}
            <div className={'WordChooser-buttonArea'}>
                {renderWordsToChoose}
            </div>
            <p>{t('customWordInfoText')}</p>
            <div className={'WordChooser-customWordArea'}>
                <Input style={{height: '4rem', border: 'none', borderRadius: '2px 0 0 2px', boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)'}} onPressEnter={() => onWordClicked(customWord)} placeholder={t('customWordPlaceholder')} value={customWord} autoFocus onChange={(event) => setCustomWord(event.target.value)}/>
                <PrimaryButton disabled={customWord.trim().length === 0} style={{height: '4rem'}} onClick={() => onWordClicked(customWord)} value={t('customWordSubmit')} />
            </div>
        </div>
    )


}