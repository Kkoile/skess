import React, {useContext} from 'react';
import './PartyLobby.css';
import {AppContext} from "../contexts/AppContext";
import {message, Button, List, Tooltip, Select, InputNumber} from "antd";
import {CopyOutlined} from '@ant-design/icons'
import copy from "clipboard-copy";
import {PartyContext} from "../contexts/PartyContext";
import PrimaryButton from "../components/PrimaryButton";
import Avatar from "../components/Avatar";
import {useTranslation} from "react-i18next";

export default function PartyLobby() {

    const [{user, supportedLanguages}] = useContext(AppContext);
    const {party, updatePartyOption, startNewGame, joinActiveGame} = useContext(PartyContext);
    const {t} = useTranslation('partyLobby');

    const url = `${window.location.href}`;
    const copyUrl = async () => {
        await copy(url);
        message.success('Copied to clipboard');
    }

    const renderSupportedLanguages = supportedLanguages.map(supportedLanguage => {
        return <Select.Option key={supportedLanguage} value={supportedLanguage}>{supportedLanguage}</Select.Option>
    })

    const onDrawTimeOptionChanged = (value) => {
        updatePartyOption({...party.options, timeToDraw: value});
    };

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

    return (
        <div className="PartyLobby">
            <div className={'PartyLobby-header'}>
                <h1>{t('title')} <u>{party.id}</u></h1>
                <Tooltip title={'copy'}>
                    <Button
                        size={'large'}
                        onClick={copyUrl}
                        type={'ghost'}
                        className={'PartyLobby-copyButton'}
                        icon={<CopyOutlined />}/>
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
                    <InputNumber style={{width: '10rem'}} value={party.options.timeToDraw} onChange={onDrawTimeOptionChanged} disabled={party.hostId !== user.id}/>
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
                {party.activeGame && (
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '1rem'}}>
                        <div>{t('joinGameInfoText')}</div>
                        <PrimaryButton style={{padding: '0.5rem 1rem', borderRadius: '10px'}} onClick={joinActiveGame} value={t('joinGameButton')} />
                    </div>
                )}
            </div>
        </div>
    );
}
