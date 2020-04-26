import React, {useContext, useState} from 'react';
import {GameContext} from "../contexts/GameContext";
import './WordChooser.css';
import PrimaryButton from "../components/PrimaryButton";
import chosenWordLeft from '../assets/chosenWordLeft.svg';
import chosenWordRight from '../assets/chosenWordRight.svg';

export default function WordChooser () {

    const {game, chooseWord} = useContext(GameContext);
    const [selectedWord, setSelectedWord] = useState(game.chosenWord);
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
                <h1>You Chose</h1>
                <div className={'WordChooser-chosenWord'}>
                    <img src={chosenWordLeft} />
                    <PrimaryButton style={{margin: '2rem'}} value={selectedWord} />
                    <img src={chosenWordRight} />
                </div>
                <p>Waiting for others to choose a word</p>
            </div>
        )
    }
    return (
        <div className={'WordChooser'}>
            <h1>Choose one Word</h1>
            <div className={'WordChooser-buttonArea'}>
                {renderWordsToChoose}
            </div>
        </div>
    )


}