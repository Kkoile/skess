import React from 'react';
import Lobby from "./views/Lobby";
import {PartyContextProvider} from "./contexts/PartyContext";
import PartyManager from "./views/PartyManager";
import {GameContextProvider} from "./contexts/GameContext";
import GameManager from "./views/GameManager";

const routes = [
    {
        path: '/',
        component: Lobby,
        label: 'Lobby'
    },
    {
        path: '/party/:id',
        component: (props) => {
            return (
                <PartyContextProvider id={props.match.params.id} {...props} >
                    <PartyManager {...props} />
                </PartyContextProvider>
                )
        },
        label: 'Party'
    },
    {
        path: '/party/:partyId/game/:gameId',
        component: (props) => {
            return (
                <PartyContextProvider id={props.match.params.partyId} {...props}>
                    <GameContextProvider id={props.match.params.gameId} {...props}>
                        <GameManager {...props} />
                    </GameContextProvider>
                </PartyContextProvider>
            )
        }
    },
    {
        component: ({history}) => {
            history.replace('/');
            return 'Redirecting...';
        }
    }
]

export default routes;