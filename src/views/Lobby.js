import React, {useContext, useState} from 'react';
import './Lobby.css';
import axios from 'axios';
import {Button, Input, Modal} from "antd";
import {AppContext} from "../contexts/AppContext";

export default function Lobby({history}) {

    const [state, setState] = useContext(AppContext);
    const {user} = state;
    const [showGameIdInput, setShowGameIdInput] = useState(false);
    const [gameId, setGameId] = useState('');

    const onCreateNewGameClicked = async () => {
        const {data} = await axios.post('createGame');
        history.push(`/game/${data.id}`);
    }

    const onJoinGameClicked = () => {
        setGameId('');
        setShowGameIdInput(true);
    }

    const handleCancelJoinGame = () => {
        setShowGameIdInput(false);
    }

    const handleJoinGame = () => {
        history.push(`game/${gameId}`);
    }

    const onLogoutClicked = () => {
        setState({...state, user: {id: null, name: null}});
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        history.replace("/");
    }

  return (
    <div className="Lobby" >
        <div className={'Lobby-header'}>
            <h1>Welcome {user.name}</h1>
        </div>
        <div className={'Lobby-buttons'}>
          <Button className={'Lobby-button'} size={'large'} type={'primary'} onClick={onCreateNewGameClicked}>Create new Game</Button>
          <Button className={'Lobby-button'} size={'large'} onClick={onJoinGameClicked}>Join Game</Button>
          <Button className={'Lobby-button'} size={'small'} type={'danger'} onClick={onLogoutClicked}>Logout</Button>
        </div>
        <Modal visible={showGameIdInput} title={'Join Game'} footer={[
            <Button key={'back'} onClick={handleCancelJoinGame}>Cancel</Button>,
            <Button type={'primary'} key={'submit'} onClick={handleJoinGame}>Join</Button>
        ]}>
            <p>Enter the id of the game:</p>
            <Input autoFocus={true} value={gameId} onChange={(event) => setGameId(event.target.value)}/>
        </Modal>
    </div>
  );
}
