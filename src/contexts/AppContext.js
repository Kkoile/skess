import React, {useState, createContext, useEffect, useContext} from 'react';
import axios from 'axios';
import * as randomHash from "random-hash";
import {useTranslation} from "react-i18next";

const initialState = {
    user: {id: null, name: null},
    supportedLanguages: ['en', 'de']
};

export const AppContext = createContext(undefined);

export const AppContextProvider = (props) => {
    const [state, setState] = useState(initialState);
    const {t} = useTranslation('general');

    const changeName = (name) => {
        localStorage.setItem('x-userName', name);
        setState({...state, user: {...state.user, name}});
    }

    useEffect(() => {
        let userName = localStorage.getItem("x-userName");
        let userId = localStorage.getItem("x-userId");
        if (!userId) {
            userId = randomHash.generateHash()
            userName = `${t('playerName')} ${Math.floor(Math.random()*1000)}`;
            localStorage.setItem('x-userId', userId);
            localStorage.setItem('x-userName', userName);
        }
        setState(state => ({...state, user: {id: userId, name: userName}}));
    }, []);

    useEffect(() => {
        axios.defaults.headers.common['x-user'] = state.user.id;
    }, [state.user.id]);

    useEffect(() => {
        if (state.user.id) {
            axios.post('/api/user', state.user);
        }
    }, [state.user]);

    if (!state.user.id) {
        return <div>Loading...</div>
    }

    return (
        <AppContext.Provider value={{state, changeName}}>
            {props.children}
        </AppContext.Provider>
    );
}