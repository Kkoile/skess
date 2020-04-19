import React, {useContext} from 'react';
import './GameLobby.css';
import {AppContext} from "../contexts/AppContext";
import {message, Button, List, Tooltip, Select, InputNumber} from "antd";
import {CopyOutlined} from '@ant-design/icons'
import copy from "clipboard-copy";

export default function GameLobby({game, onStartGamePressed, onDrawTimeOptionChanged, onLanguageOptionChanged}) {

    const [{user, supportedLanguages}] = useContext(AppContext);

    const url = `${window.location.href}`;
    const copyUrl = async () => {
        await copy(url);
        message.success('Copied to clipboard');
    }

    const renderSupportedLanguages = supportedLanguages.map(supportedLanguage => {
        return <Select.Option value={supportedLanguage}>{supportedLanguage}</Select.Option>
    })

    return (
        <div className="GameLobby">
            <div className={'GameLobby-header'}>
                <h1>Game Lobby {game.id}</h1>
                <div className={'GameLobby-urlArea'}>
                    Send this link to your friends:
                    <div className={'GameLobby-url'}>
                        <h2 style={{marginBottom: 0}}>{url}</h2>
                        <Tooltip title={'copy'}>
                            <Button
                                onClick={copyUrl}
                                type={'ghost'}
                                className={'GameLobby-copyButton'}
                                icon={<CopyOutlined />}/>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <h2>Player: </h2>
            <List className={'GameLobby-playerList'} dataSource={game.player} renderItem={item => (
                <List.Item className={'GameLobby-playerItem'}>
                    <p className={'GameLobby-playerName'}>{item.name}</p>
                </List.Item>
            )}>
            </List>
            {(game.host === user.id) &&
                <div className={'GameLobby-options'}>
                    <div className={'GameLobby-option'}>
                        <h2>Language</h2>
                        <Select value={game.options.language} onChange={onLanguageOptionChanged}>
                            {renderSupportedLanguages}
                        </Select>
                    </div>
                    <div className={'GameLobby-option'}>
                        <h2>Time to Draw</h2>
                        <InputNumber value={game.options.timeToDraw} onChange={onDrawTimeOptionChanged}/>
                    </div>
                </div>
            }
            {(game.host === user.id) && (
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    {game.player.length < 3 && <div>At least 3 people required to play a game</div>}
                    <Button type={'primary'} size={'large'} disabled={game.player.length < 3} onClick={onStartGamePressed}>Start Game</Button>
                </div>
            )}
        </div>
    );
}
