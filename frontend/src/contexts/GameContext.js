import React, {useState, createContext, useEffect, useContext} from 'react';
import axios from 'axios';
import {PartyContext} from "./PartyContext";
import {AppContext} from "./AppContext";

const initialState = {id: null, partyId: null, player: [], status: 'LOADING', options: {}, allRounds: [], numberOfRounds: -1, currentRoundIndex: -1};

export const GameContext = createContext(undefined);

export const GameContextProvider = ({id, ...props}) => {
    const {isSocketConnected, socket, party} = useContext(PartyContext);
    const {state} = useContext(AppContext);
    const {user} = state;

    const [game, setGame] = useState(initialState);

    const loadGame = async (id) => {
        try {
            const {data} = await axios.get(`/api/game/${id}`);
            setGame(data);
        } catch (err) {
            if (err.response.status === 404) {
                setGame(game => ({...game, status: 'NOT_EXISTING'}));
            } else if (err.response.data.code === 'NOT_PART_OF_GAME') {
                setGame(game => ({...game, status: 'NOT_PART_OF_GAME'}));
            } else {
                alert(err.response.data)
            }
        }
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

    const updateEndScreenState = async (endScreenState) => {
        setGame(game => ({...game, endScreenState}))
        if (party.hostId === user.id) {
            await axios.post(`/api/game/${game.id}/updateEndScreenState`, endScreenState);
        }
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
        <GameContext.Provider value={{game, chooseWord, submitImage, submitGuess, getNameOfPlayer, updateEndScreenState}}>
            {props.children}
        </GameContext.Provider>
    );
}