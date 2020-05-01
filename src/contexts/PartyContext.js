import React, {useState, createContext, useEffect, useContext} from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import {AppContext} from "./AppContext";

const initialState = {id: null, hostId: null, player: [], games: [], activeGame: null, options: {language: 'en', timeToDraw: 60}};

export const PartyContext = createContext(undefined);

export const PartyContextProvider = ({id, ...props}) => {
    const {state} = useContext(AppContext);
    const {user} = state;
    const [party, setParty] = useState(initialState);
    const [socket] = useState(socketIOClient({path: '/api/socket.io/'}));
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const createNewParty = async () => {
        const {data} = await axios.post('/api/party');
        setParty(data);
        return data;
    };

    const updatePartyOption = async (options) => {
        setParty({...party, options});
        await axios.post(`/api/party/${id}/options`, options);
    };

    const enterParty = async (id) => {
        await axios.post(`/api/party/${id}/enter`)
    };

    const startNewGame = async () => {
        const {data} = await axios.post(`/api/party/${id}/createGame`);
        setParty({...party, activeGame: data});
        props.history.push(`/party/${id}/game/${data}`);
    };

    const goToGame = async (gameId) => {
        props.history.push(`/party/${id}/game/${gameId}`);
    };

    useEffect(() => {
        if (socket && user.id && id) {
            socket.emit('login', {userId: user.id, partyId: id});
        }
    }, [socket, user.id, id]);

    useEffect(() => {
        if (isSocketConnected) {
            enterParty(id);
        }
    }, [isSocketConnected, id]);

    useEffect(() => {
        if (socket) {
            socket.on('partyStateChanged', (newState) => {
                setParty(newState);
            });
            socket.on('socketConnectionEstablished', () => {
                setIsSocketConnected(true);
            });
            socket.on('GAME_STARTED', (gameId) => {
                props.history.push(`/party/${id}/game/${gameId}`);
            });
        }
        return () => {
            socket.close();
        }
    }, [socket, id, props.history])

    return (
        <PartyContext.Provider value={{party, createNewParty, updatePartyOption, startNewGame, goToGame, isSocketConnected, socket}}>
            {props.children}
        </PartyContext.Provider>
    );
}