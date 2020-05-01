import React, {useContext, useState} from 'react';
import {GameContext} from "../contexts/GameContext";
import './WordChooser.css';
import PrimaryButton from "../components/PrimaryButton";
import chosenWordLeft from '../assets/chosenWordLeft.svg';
import chosenWordRight from '../assets/chosenWordRight.svg';
import {useTranslation} from "react-i18next";

export default function WordChooser () {

    const {game, chooseWord} = useContext(GameContext);
    const [selectedWord, setSelectedWord] = useState(game.chosenWord);
    const {t} = useTranslation('game');

    const renderWordsToChoose = game.wordsToChoose.map((word, i) => {
        return <PrimaryButton style={{margin: '0 1rem'}} key={i} onClick={() => onWordClicked(word)} value={word}/>
    });

    const onWordClicked = (word) => {
        setSelectedWord(word);
        setTimeout(() => {
            chooseWord(word);
        }, 1000);
    };

    if (game.chosenWord || selectedWord) {
        return (
            <div className={'WordChooser'}>
                <h1>{t('chosenWordTitle')}</h1>
                <div className={'WordChooser-chosenWord'}>
                    <img src={chosenWordLeft} />
                    <PrimaryButton style={{margin: '2rem'}} value={selectedWord} />
                    <img src={chosenWordRight} />
                </div>
                <p>{t('chosenWordWaitingText')}</p>
                {game.player.length % 2 === 1 && <p>{t('oddNumberOfPlayersChosenInfoText')}</p>}
            </div>
        )
    }
    return (
        <div className={'WordChooser'}>
            <h1>{t('chooseWordTitle')}</h1>
            <div className={'WordChooser-buttonArea'}>
                {renderWordsToChoose}
            </div>
            {game.player.length % 2 === 0 && <h2>{t('evenNumberOfPlayersInfoText')}</h2>}
            {game.player.length % 2 === 1 && <h2>{t('oddNumberOfPlayersInfoText')}</h2>}
        </div>
    )


}