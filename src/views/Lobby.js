import React, {useContext, useState} from 'react';
import './Lobby.css';
import {Button, Input, Modal} from "antd";
import {AppContext} from "../contexts/AppContext";
import {PartyContext} from "../contexts/PartyContext";
import PrimaryButton from "../components/PrimaryButton";

export default function Lobby({history}) {

    const [state] = useContext(AppContext);
    const {createNewParty} = useContext(PartyContext);
    const {user} = state;
    const [partyId, setPartyId] = useState('');

    const onCreateNewGameClicked = async () => {
        const party = await createNewParty();
        history.push(`/party/${party.id}`);
    }

    const onJoinGameClicked = () => {
        history.push(`/party/${partyId}`);
    }

  return (
    <div className="Lobby" >
        <div className={'Lobby-header'}>
            <h1>Welcome, <u>{user.name}</u></h1>
        </div>
          <PrimaryButton value={'Create new Game'} style={{ height: '3rem', padding: '0.5rem 1rem', borderRadius: '10px'}} onClick={onCreateNewGameClicked} />

          <div className={'Lobby-JoinGameArea'}>
            <p style={{margin: 0}}>Or join a game</p>
              <div className={'Lobby-JoinGameInput'}>
                  <Input className={'Lobby-JoinGameInputInput'} placeholder={'Enter Game ID'} onPressEnter={onJoinGameClicked} value={partyId} onChange={(event) => setPartyId(event.target.value)}/>
                <Button className={'Lobby-JoinGameInputButton'} size={'large'} onClick={onJoinGameClicked}>GO</Button>
              </div>
          </div>
    </div>
  );
}
