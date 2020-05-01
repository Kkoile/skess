import React, {useContext, useEffect, useState} from 'react';
import './GameEndScreen.css';
import {FaChevronRight, FaChevronLeft} from "react-icons/fa";
import {GameContext} from "../contexts/GameContext";
import Avatar from "../components/Avatar";
import PrimaryButton from "../components/PrimaryButton";
import {useTranslation} from "react-i18next";

export default function GameEndScreen({history}) {

    const {game, getNameOfPlayer} = useContext(GameContext);
    const [selectedPlayer, setSelectedPlayer] = useState(game.allRounds[0].playerId);
    const [currentRoundsPerWord, setCurrentRoundsPerWord] = useState({word: null, rounds: []});
    const [roundIndex, setRoundIndex] = useState(0);
    const [guessIsShowing, setGuessIsShowing] = useState(false);
    const {t} = useTranslation('game');

    const onPlayAgainClicked = () => {
        history.replace(`/party/${game.partyId}`);
    }

    const onPlayerClicked = (playerId) => {
        setGuessIsShowing(false);
        setRoundIndex(0);
        setSelectedPlayer(playerId);
    }

    const onPreviousClicked = () => {
        if (roundIndex > 0) {
            setRoundIndex(roundIndex - 1);
            setGuessIsShowing(false);
        }
    }

    const onNextClicked = () => {
        if ((roundIndex >= currentRoundsPerWord.rounds.length - 1 && guessIsShowing)) {
            return;
        }
        if (guessIsShowing) {
            setGuessIsShowing(false);
            setRoundIndex(roundIndex + 1);
        } else {
            setGuessIsShowing(true);
        }
    }

    useEffect(() => {
        const roundsPerWord = game.allRounds.find(roundsPerWord => roundsPerWord.playerId === selectedPlayer);
        const rounds = [];
        let index = 0;
        roundsPerWord.rounds.forEach((round, i) => {
            if (i % 2 === 0) {
                rounds.push({
                    image: round.image,
                    drawnBy: getNameOfPlayer(round.playerId)
                })
            } else {
                rounds[index].guess = round.guess;
                rounds[index].guessedBy = getNameOfPlayer(round.playerId);
                index++;
            }
        })
        setCurrentRoundsPerWord({word: roundsPerWord.word, rounds});
    }, [game, getNameOfPlayer, selectedPlayer]);

    const renderRoundsPerWord = game.allRounds.map(roundsPerWord => {
        return (
            <div key={roundsPerWord.playerId} className={'GameEndScreen-playerItem'} onClick={() => onPlayerClicked(roundsPerWord.playerId)}>
                <Avatar value={getNameOfPlayer(roundsPerWord.playerId)} />
                <h2 className={'GameEndScreen-playerItemName'}>{getNameOfPlayer(roundsPerWord.playerId)}</h2>
                <div style={{width: '100%', height: '0.5rem', backgroundColor: selectedPlayer === roundsPerWord.playerId ? 'white' : 'transparent'}}/>
            </div>
        )
    })

    const currentRound = currentRoundsPerWord.rounds[roundIndex];

    return (
        <div className={'GameEndScreen'}>
            <div className={'GameEndScreen-header'}>
                <h1>{t('gameEndTitle')}</h1>
                <PrimaryButton style={{borderRadius: '10px', marginBottom: '1rem', marginLeft: '2rem'}} value={t('gameEndPlayAgainButton')} onClick={onPlayAgainClicked} />
            </div>
            <div className={'GameEndScreen-playerList'}>
                {renderRoundsPerWord}
            </div>
            {!!currentRound &&
                <div className={'GameEndScreen-resultArea'}>
                    {guessIsShowing &&
                        <div className={'GameEndScreen-guessBlock'}>
                            <p className={'GameEndScreen-guess'}>{t('gameEndGuessText', {userName: currentRound.guessedBy})} <u>{currentRound.guess}</u></p>
                        </div>
                    }
                    <div
                        className={'GameEndScreen-previousButton ' + (roundIndex < 1 ? '' : 'GameEndScreen-previousButtonEnabled')}
                        onClick={onPreviousClicked}
                    >
                        <FaChevronLeft size={'6rem'} color={roundIndex < 1 ? 'lightgrey' : 'white'}/>
                    </div>
                    <div
                        className={'GameEndScreen-nextButton ' + ((roundIndex >= currentRoundsPerWord.rounds.length - 1 && guessIsShowing) ? '' : 'GameEndScreen-nextButtonEnabled')}
                        onClick={onNextClicked}
                    >
                        <FaChevronRight size={'6rem'} color={(roundIndex >= currentRoundsPerWord.rounds.length - 1 && guessIsShowing) ? 'lightgrey' : 'white'}/>
                    </div>
                    <img className={'GameEndScreen-image'} src={currentRound.image}/>
                    <PrimaryButton style={{width: '75%', position: 'absolute', bottom: '-2rem', textAlign: 'center'}} value={currentRoundsPerWord.word}/>
                </div>
            }
        </div>
    );
}
