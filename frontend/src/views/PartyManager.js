import React, {useContext} from 'react';
import PartyLobby from "./PartyLobby";
import {PartyContext} from "../contexts/PartyContext";
import PartyNotExistingView from "./PartyNotExistingView";

export default function PartyManager (props) {

    const {party} = useContext(PartyContext);

    if (party.notExisting) {
        return <PartyNotExistingView {...props} />
    }

    return <PartyLobby {...props}/>

}