import React, {useState, createContext, useEffect, useContext} from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import {AppContext} from "./AppContext";

const initialState = {id: null, hostId: null, player: [], games: [], activeGame: null, options: {language: 'en', timeToDraw: 60}, notExisting: false};

export const PartyContext = createContext(undefined);

export const PartyContextProvider = ({id, ...props}) => {
    const {state} = useContext(AppContext);
    const {user} = state;
    const [party, setParty] = useState(initialState);
    const [socket, setSocket] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const createNewParty = async () => {
        const {data} = await axios.post('/api/party');
        setParty(data);
        return data;
    };

    const updatePartyOption = async (options) => {
        if (user.id === party.hostId) {
            setParty({...party, options});
            await axios.post(`/api/party/${id}/options`, options);
        }
    };

    const loadParty = async (id) => {
        try {
            const {data} = await axios.get(`/api/party/${id}`)
            setParty(data);
        } catch(err) {
            if (err.response.status === 404) {
                setParty(party => ({...party, notExisting: true}));
            }
        }
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
        if (id && !socket) {
            setSocket(socketIOClient({path: '/api/socket.io/'}));
        }
    }, [socket, id]);

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
        if (id) {
            loadParty(id)
        }
    }, [id]);

    useEffect(() => {
        if (socket) {
            socket.on('reconnect', () => {
                if (user.id && id) {
                    socket.emit('login', {userId: user.id, partyId: id});
                }
            })
            socket.on('partyStateChanged', (newState) => {
                setParty(newState);
            });
            socket.on('socketConnectionEstablished', () => {
                setIsSocketConnected(true);
            });
            socket.on('GAME_STARTED', (gameId) => {
                props.history.push(`/party/${id}/game/${gameId}`);
            });
            return () => {
                socket.close();
            }
        }
    }, [socket, user.id, id, props.history])

    return (
        <PartyContext.Provider value={{party, createNewParty, updatePartyOption, startNewGame, goToGame, isSocketConnected, socket}}>
            {props.children}
        </PartyContext.Provider>
    );
}