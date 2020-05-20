import React from 'react';
import Lobby from "./views/Lobby";
import {PartyContextProvider} from "./contexts/PartyContext";
import PartyManager from "./views/PartyManager";
import {GameContextProvider} from "./contexts/GameContext";
import GameManager from "./views/GameManager";
import Impressum from "./views/Impressum";
import DataPrivacy from "./views/DataPrivacy";

const routes = [
    {
        path: '/',
        component: Lobby,
        label: 'Lobby'
    },
    {
        path: '/imprint',
        component: Impressum,
        label: 'Impressum'
    },
    {
        path: '/dataPrivacyStatement',
        component: DataPrivacy,
        label: 'Data Privacy Statement'
    },
    {
        path: '/party/:partyId',
        component: (props) => {
            return (
                <PartyContextProvider id={props.match.params.partyId} {...props} >
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
