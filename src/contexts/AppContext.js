import React, { useState, createContext } from "react";
import axios from "axios";

export const AppContext = createContext(undefined);

export const AppContextProvider = props => {
    const userName = localStorage.getItem("x-userName");
    const userId = localStorage.getItem("x-userId");
    const [state, setState] = useState({
        user: {
            name: userName || null,
            id: userId || null
        },
        supportedLanguages: ['en', 'de']
    });

    if (state.user.id) {
        axios.defaults.headers.common['x-user'] = state.user.id;
    }

    return (
        <AppContext.Provider value={[state, setState]}>
            {props.children}
        </AppContext.Provider>
    );
};
