import React, {useContext, useRef} from 'react';
import './PartyLobby.css';
import {AppContext} from "../contexts/AppContext";
import {message, Button, Tooltip, Select, InputNumber, Input} from "antd";
import {CopyOutlined} from '@ant-design/icons'
import copy from "clipboard-copy";
import {PartyContext} from "../contexts/PartyContext";
import PrimaryButton from "../components/PrimaryButton";
import Avatar from "../components/Avatar";
import {useTranslation} from "react-i18next";
import Pencil from "../assets/pencil.svg";

export default function PartyLobby({history}) {

    const {state, changeName} = useContext(AppContext);
    const {user, supportedLanguages} = state;
    const {party, updatePartyOption, startNewGame, goToGame} = useContext(PartyContext);
    const nameInput = useRef(null);
    const {t} = useTranslation('partyLobby');

    const url = `${window.location.href}`;
    const copyUrl = async () => {
        await copy(url);
        message.success('Copied to clipboard');
    }

    const renderSupportedLanguages = supportedLanguages.map(supportedLanguage => {
        return <Select.Option key={supportedLanguage} value={supportedLanguage}>{t(supportedLanguage)}</Select.Option>
    })

    const onDrawTimeOptionChanged = (value) => {
        if (value > 0) {
            updatePartyOption({...party.options, timeToDraw: value});
        }
    };

    const onLeavePartyClicked = () => {
        history.push('/');
    };

    const onNameChanged = (event) => {
        changeName(event.target.value);
    }

    const onChangeNameClicked = () => {
        nameInput.current.focus();
    }

    const onLanguageOptionChanged = (value) => {
        updatePartyOption({...party.options, language: value});
    }

    if (!party.id) {
        return <div>Loading...</div>
    }

    const renderPlayer = party.player.map(player => {
        return (
            <div key={player.id} className={'PartyLobby-playerItem'}>
                <Avatar value={player.name} />
                <h2  className={'PartyLobby-playerItemName'}>{player.name}</h2>
            </div>
        )
    })

    const renderPreviousGames = party.games.map(gameId => {
        return (
            <div key={gameId} className={'PartyLobby-previousGamesItem'} onClick={() => goToGame(gameId)}>
                <p>{gameId}</p>
                {gameId === party.activeGame && (
                    <div className={'PartyLobby-activeGame'}>
                        {t('goToGame')}
                    </div>
                )}
                {gameId !== party.activeGame && (
                    <div className={'PartyLobby-previousGameGoToResults'}>
                        {t('showResults')}
                    </div>
                )}
            </div>
        )
    })

    return (
        <div className="PartyLobby">
            <Button type={'danger'} className={'PartyLobby-leaveButton'} onClick={onLeavePartyClicked}>{t('leaveParty')}</Button>
            <div className={'PartyLobby-header'}>
                <h2>{t('title')} </h2><h1><u>{party.id}</u></h1>
                <Tooltip title={t('copy')}>
                    <Button
                        size={'large'}
                        onClick={copyUrl}
                        type={'ghost'}
                        className={'PartyLobby-copyButton'}
                        icon={<CopyOutlined />}/>
                </Tooltip>
            </div>
            <div className={'PartyLobby-mainArea'}>
                <div className={'PartyLobby-mainAreaLeft'}>
                    <div className={'PartyLobby-nameArea'}>
                        <h2>{t('youAreUser')}</h2><Input className={'PartyLobby-nameInput'} style={{textAlign: 'right', width: 'auto', maxWidth: `${(user.name.length + 1) * 2}rem`}} ref={nameInput} value={user.name} onChange={onNameChanged} />
                        <Tooltip title={t('changeName')}>
                            <img className={'PartyLobby-editNameButton'} onClick={onChangeNameClicked} src={Pencil} />
                        </Tooltip>
                    </div>
                    <div className={'PartyLobby-options'}>
                        <div className={'PartyLobby-option'}>
                            <h2>{t('languageOptionLabel')}</h2>
                            <Select style={{width: '10rem', borderRadius: '20px'}} value={party.options.language} onChange={onLanguageOptionChanged} disabled={party.hostId !== user.id}>
                                {renderSupportedLanguages}
                            </Select>
                        </div>
                        <div className={'PartyLobby-option'}>
                            <h2>{t('timeOptionLabel')}</h2>
                            <div className={'PartyLobby-timeOptionSeconds'}>
                                <InputNumber style={{width: '4rem'}} value={party.options.timeToDraw} onChange={onDrawTimeOptionChanged} disabled={party.hostId !== user.id}/>
                                <p style={{marginBottom: 0, marginLeft: '0.5rem'}}>{t('seconds')}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'PartyLobby-playerArea'}>
                        <h3>{t('playerTitle')} ({party.player.length})</h3>
                        <div className={'PartyLobby-playerList'}>
                            {renderPlayer}
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                        {(party.hostId === user.id) && (
                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                {party.player.length < 2 && <div>{t('notEnoughPlayerInfoText')}</div>}
                                <PrimaryButton style={{padding: '0.5rem 1rem', borderRadius: '10px'}} disabled={party.player.length < 2} onClick={startNewGame} value={t('startGameButton')} />
                            </div>
                        )}
                        {(party.hostId !== user.id) && (
                            <p>{t('waitingForHost')}</p>
                        )}
                    </div>
                </div>
                {party.games.length > 0 && (
                    <div className={'PartyLobby-previousGames'}>
                        <h2>{t('previousGamesTitle')}</h2>
                        <div className={'PartyLobby-previousGamesList'}>
                            {renderPreviousGames}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
