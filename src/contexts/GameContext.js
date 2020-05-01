import React, {useState, createContext, useEffect, useContext} from 'react';
import axios from 'axios';
import {PartyContext} from "./PartyContext";

const initialState = {id: null, partyId: null, player: [], status: 'LOADING', options: {}, allRounds: [], numberOfRounds: -1, currentRoundIndex: -1};

export const GameContext = createContext(undefined);

export const GameContextProvider = ({id, ...props}) => {
    const {isSocketConnected, socket} = useContext(PartyContext);

    const [game, setGame] = useState(initialState);

    const loadGame = async (id) => {
        const {data} = await axios.get(`/api/game/${id}`);
        setGame(data);
    }

    const chooseWord = async (word) => {
        setGame({...game, chosenWord: word});
        await axios.post(`/api/game/${id}/chooseWord`, {word});
    }

    const submitImage = async (image) => {
        try {
            setGame((game) => {return{...game, currentRound: {...game.currentRound, submitted: true}}});
            await axios.post(`/api/game/${game.id}/submitRound`, { image });
        } catch (err) {
            alert(err.message)
        }
    }

    const submitGuess = async (guess) => {
        try {
            setGame((game) => {return{...game, currentRound: {...game.currentRound, guess}}});
            await axios.post(`/api/game/${game.id}/submitRound`, { guess });
        } catch (err) {
            alert(err.message)
        }
    }

    const getNameOfPlayer = (playerId) => {
        const player = game.player.find(player => player.id === playerId);
        return player.name
    }

    useEffect(() => {
        if (isSocketConnected && id) {
            loadGame(id);
        }
    }, [id, isSocketConnected]);

    useEffect(() => {
        if (socket) {
            socket.on('newGameState', (newState) => {
                setGame(newState);
            });
        }
    }, [socket]);

    return (
        <GameContext.Provider value={{game, chooseWord, submitImage, submitGuess, getNameOfPlayer}}>
            {props.children}
        </GameContext.Provider>
    );
}