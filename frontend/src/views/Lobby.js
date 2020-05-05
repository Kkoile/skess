import React, {useContext, useRef, useState} from 'react';
import './Lobby.css';
import {Button, Input, Tooltip} from "antd";
import {AppContext} from "../contexts/AppContext";
import {PartyContext} from "../contexts/PartyContext";
import PrimaryButton from "../components/PrimaryButton";
import {useTranslation} from "react-i18next";
import Pencil from '../assets/pencil.svg';

export default function Lobby({history}) {

    const {state, changeName} = useContext(AppContext);
    const {createNewParty} = useContext(PartyContext);
    const {user} = state;
    const [partyId, setPartyId] = useState('');
    const nameInput = useRef(null);
    const {t} = useTranslation('lobby')

    const onCreateNewGameClicked = async () => {
        const party = await createNewParty();
        history.push(`/party/${party.id}`);
    }

    const onJoinGameClicked = () => {
        history.push(`/party/${partyId}`);
    }

    const onChangeNameClicked = () => {
        nameInput.current.focus();
    }

    const onNameChanged = (event) => {
        changeName(event.target.value);
    }

  return (
    <div className="Lobby" >
        <div className={'Lobby-header'}>
            <h1>{t('welcomeUser')}</h1><Input className={'Lobby-nameInput'} style={{textAlign: 'right', width: 'auto', maxWidth: `${(user.name.length + 1) * 2}rem`}} ref={nameInput} value={user.name} onChange={onNameChanged} />
            <Tooltip title={t('changeName')}>
                <img className={'Lobby-editNameButton'} onClick={onChangeNameClicked} src={Pencil} />
            </Tooltip>
        </div>
          <PrimaryButton value={t('createNewGame')} style={{ height: '3rem', padding: '0.5rem 1rem', borderRadius: '10px'}} onClick={onCreateNewGameClicked} />

          <div className={'Lobby-JoinGameArea'}>
            <p style={{margin: 0}}>{t('joinGameLabel')}</p>
              <div className={'Lobby-JoinGameInput'}>
                  <Input className={'Lobby-JoinGameInputInput'} placeholder={t('joinGamePlaceholder')} onPressEnter={onJoinGameClicked} value={partyId} onChange={(event) => setPartyId(event.target.value)}/>
                <Button className={'Lobby-JoinGameInputButton'} size={'large'} onClick={onJoinGameClicked}>{t('joinGameButton')}</Button>
              </div>
          </div>
    </div>
  );
}
