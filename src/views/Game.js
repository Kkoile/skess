import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../contexts/AppContext";
import socketIOClient from "socket.io-client";
import GameLobby from "./GameLobby";
import axios from 'axios';
import GameBoard from "./GameBoard";
import GameEndScreen from "./GameEndScreen";
import {Button, Modal} from "antd";

export default function ({match, history}) {
    const [state] = useContext(AppContext);
    const [isLoading, setLoading] = useState(true);
    const [game, setGame] = useState({id: match.params.id, host: {}, player: [], options: {language: 'en', timeToDraw: 60}, isRunning: false});
    const [wordsToChoose, setWordsToChoose] = useState(null);
    const [round, setRound] = useState(null);
    const [doesGameExist, setGameExists] = useState(undefined);
    const [socket] = useState(socketIOClient({path: '/api/socket.io/'}));

    const onReturnToHomeClicked = () => {
        history.replace('/')
    };

    const onStartGamePressed = async () => {
        setLoading(true);
        try {
            await axios.post(`/api/game/${game.id}/start`, null, {params: {...game.options}});
            setGame({...game, isRunning: true});
        } catch (err) {
            alert(err.message)
        }
        setLoading(false);
    };

    const onWordChosen = async (word) => {
        setWordsToChoose({...wordsToChoose, chosenWord: word});
        await axios.post(`/api/game/${game.id}/chooseWord`, { word })
    };

    const onDrawingEnded = async (image) => {
        try {
            await axios.post(`/api/game/${game.id}/submitRound`, { image });
        } catch (err) {
            alert(err.message)
        }
    };

    const submitGuess = async (guess) => {
        try {
            await axios.post(`/api/game/${game.id}/submitRound`, { guess });
        } catch (err) {
            alert(err.message)
        }
    };

    const onPlayAgainClicked = async () => {
        const {data} = await axios.post('/api/createGame', null, {params: {previousGame: game.id}});
        history.replace(`/game/${data.id}`);
    };

    const onDrawTimeOptionChanged = (value) => {
        setGame({...game, options: {...game.options, timeToDraw: value}})
    }

    const onLanguageOptionChanged = (value) => {
        setGame({...game, options: {...game.options, language: value}})
    }

    useEffect(() => {
        setGame({id: match.params.id, host: {}, player: [], options: {language: 'en', timeToDraw: 60}, isRunning: false})
        setWordsToChoose(null);
    }, [match])

    useEffect(() => {
        if (socket) {
            socket.on('playerEntered', (enteringPlayer) => {
                setGame(game => {return {...game, player: game.player.concat(enteringPlayer)}});
            });
            socket.on('playerLeft', (oldPlayer) => {
                setGame(game => {
                    return {...game, player: game.player.filter(singlePlayer => singlePlayer.id !== oldPlayer.id)}
                });
            });
            socket.on('gameOptions', (options) => {
                setGame(game => {return {...game, options}})
            });
            socket.on('wordsToChoose', (wordsToChoose) => {
                setWordsToChoose(wordsToChoose);
            });
            socket.on('nextRound', (round) => {
                setRound(round)
                setWordsToChoose(null);
                setGame(game => {return {...game, isRunning: true}})
            });
            socket.on('gameEnded', (game) => {
                setGame(game);
            });
        }
        return () => {
            socket.close();
        }
    }, [socket])

    useEffect(() => {
        if (socket) {
            socket.emit('login', state.user);
        }
    }, [socket, state.user]);

    useEffect(() => {
        if (socket) {
            socket.emit('enterGame', {gameId: game.id});
        }
    }, [socket, game.id]);

    useEffect(() => {
        axios.get(`/api/game/${game.id}`).then(({data}) => {
            const {currentRound, wordsToChoose, ...game} = data;
            setGame(game);
            setRound(currentRound);
            setWordsToChoose(wordsToChoose);
        }).catch(err => {
            if(err.response.status === 404) {
                setGameExists(false);
            } else {
                alert(err.message);
            }
        }).finally(() => {
            setLoading(false);
        })
    }, [game.id]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (doesGameExist === false) {
        return (
            <div style={{backgroundColor: 'primary', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <h2>Game with id '{game.id}' does not exist.</h2>
                <Button type={'primary'} onClick={onReturnToHomeClicked}>Return to Home</Button>
            </div>
        )
    }

    if (game.finished) {
        return <GameEndScreen game={game} onPlayAgainClicked={onPlayAgainClicked}/>
    }

    if (wordsToChoose) {
        const renderWords = wordsToChoose.words.map(word => {
            return <Button key={word} onClick={() => onWordChosen(word)}>{word}</Button>
        })
        return (
            <Modal visible title={'Choose Word'} footer={[]}>
                {!wordsToChoose.chosenWord && (
                    <div>
                        <p>Choose one of the following words:</p>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                            {renderWords}
                        </div>
                    </div>
                )}
                {!!wordsToChoose.chosenWord && (
                    <div>
                        <p>You chose {wordsToChoose.chosenWord}. Waiting for the others to chose a word</p>
                    </div>
                )}
            </Modal>
        )
    }

    if (game.isRunning && round) {
        return <GameBoard timeToDraw={game.options.timeToDraw} round={round} onDrawingEnded={onDrawingEnded} submitGuess={submitGuess}/>
    }

    return <GameLobby
        game={game}
        onStartGamePressed={onStartGamePressed}
        onDrawTimeOptionChanged={onDrawTimeOptionChanged}
        onLanguageOptionChanged={onLanguageOptionChanged}
    />
}