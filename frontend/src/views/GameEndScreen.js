import React, {useContext, useEffect, useState} from 'react';
import './GameEndScreen.css';
import {FaChevronRight, FaChevronLeft} from "react-icons/fa";
import {GameContext} from "../contexts/GameContext";
import Avatar from "../components/Avatar";
import PrimaryButton from "../components/PrimaryButton";
import {useTranslation} from "react-i18next";

export default function GameEndScreen({history}) {

    const {game, getNameOfPlayer, updateEndScreenState} = useContext(GameContext);
    const [currentRoundsPerWord, setCurrentRoundsPerWord] = useState({word: null, rounds: []});
    const {t} = useTranslation('game');

    const onPlayAgainClicked = () => {
        history.replace(`/party/${game.partyId}`);
    }

    const onPlayerClicked = (playerId) => {
        updateEndScreenState({playerId, roundIndex: 0, isGuessShowing: false});
    }

    const onPreviousClicked = () => {
        if (game.endScreenState.roundIndex > 0) {
            updateEndScreenState({playerId: game.endScreenState.playerId, roundIndex: game.endScreenState.roundIndex - 1, isGuessShowing: false})
        }
    }

    const onNextClicked = () => {
        if ((game.endScreenState.roundIndex >= currentRoundsPerWord.rounds.length - 1 && game.endScreenState.isGuessShowing)) {
            return;
        }
        if (game.endScreenState.isGuessShowing) {
            updateEndScreenState({playerId: game.endScreenState.playerId, roundIndex: game.endScreenState.roundIndex + 1, isGuessShowing: false})
        } else {
            updateEndScreenState({playerId: game.endScreenState.playerId, roundIndex: game.endScreenState.roundIndex, isGuessShowing: true})
        }
    }

    useEffect(() => {
        const roundsPerWord = game.allRounds.find(roundsPerWord => roundsPerWord.playerId === game.endScreenState.playerId);
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
    }, [game, getNameOfPlayer]);

    const renderRoundsPerWord = game.allRounds.map(roundsPerWord => {
        return (
            <div key={roundsPerWord.playerId} className={'GameEndScreen-playerItem'} onClick={() => onPlayerClicked(roundsPerWord.playerId)}>
                <Avatar size={'3rem'} fontSize={'2rem'} value={getNameOfPlayer(roundsPerWord.playerId)} />
                <h2 className={'GameEndScreen-playerItemName'}>{getNameOfPlayer(roundsPerWord.playerId)}</h2>
                <div style={{width: '100%', height: '0.5rem', backgroundColor: game.endScreenState.playerId === roundsPerWord.playerId ? 'white' : 'transparent'}}/>
            </div>
        )
    })

    const currentRound = currentRoundsPerWord.rounds[game.endScreenState.roundIndex];

    return (
        <div className={'GameEndScreen'}>
            <div className={'GameEndScreen-header'}>
                <h1>{t('gameEndTitle')}</h1>
                <PrimaryButton style={{borderRadius: '10px', marginBottom: '1rem', marginLeft: '1rem'}} value={t('gameEndPlayAgainButton')} onClick={onPlayAgainClicked} />
            </div>
            <div className={'GameEndScreen-playerList'}>
                {renderRoundsPerWord}
            </div>
            {!!currentRound &&
                <div className={'GameEndScreen-resultArea'}>
                    <div
                        className={'GameEndScreen-previousButton ' + (game.endScreenState.roundIndex < 1 ? '' : 'GameEndScreen-previousButtonEnabled')}
                        onClick={onPreviousClicked}
                    >
                        <FaChevronLeft size={'4rem'} color={game.endScreenState.roundIndex < 1 ? 'lightgrey' : 'white'}/>
                    </div>
                    <div className={'GameEndScreen-imageArea'}>
                        {game.endScreenState.isGuessShowing &&
                        <div className={'GameEndScreen-guessBlock'}>
                            <p className={'GameEndScreen-guess'}>{t('gameEndGuessText', {userName: currentRound.guessedBy})} <u>{currentRound.guess}</u></p>
                        </div>
                        }
                        <img className={'GameEndScreen-image'} src={currentRound.image}/>
                        <PrimaryButton style={{width: '110%', position: 'absolute', left: '-5%', bottom: '-2rem', textAlign: 'center'}} value={currentRoundsPerWord.word}/>
                    </div>
                    <div
                        className={'GameEndScreen-nextButton ' + ((game.endScreenState.roundIndex >= currentRoundsPerWord.rounds.length - 1 && game.endScreenState.isGuessShowing) ? '' : 'GameEndScreen-nextButtonEnabled')}
                        onClick={onNextClicked}
                    >
                        <FaChevronRight size={'4rem'} color={(game.endScreenState.roundIndex >= currentRoundsPerWord.rounds.length - 1 && game.endScreenState.isGuessShowing) ? 'lightgrey' : 'white'}/>
                    </div>
                </div>
            }
        </div>
    );
}
