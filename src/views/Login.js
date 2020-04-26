import React, {useContext, useState} from 'react';
import logo from '../logo.svg';
import './Login.css';
import * as randomHash from 'random-hash';
import {AppContext} from "../contexts/AppContext";
import {Button, Input} from "antd";
import axios from 'axios';

export default function Login() {
  const [state, setState] = useContext(AppContext);
  const [name, setName] = useState(`Random Player ${Math.floor(Math.random()*1000)}`);
  const [id] = useState(randomHash.generateHash());

  const onPlayClicked = async () => {
    const {data} = await axios.post('/api/user', {id, name})
    setState({...state, user: data});
    localStorage.setItem('x-userId', id);
    localStorage.setItem('x-userName', name);
  };

  return (
    <div className="Login">
      <header className="Login-header">
        <img src={logo} className="Login-logo" alt="logo" />
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: 20}}>
            User Name:
            <Input style={{height: '3rem'}} autoFocus onPressEnter={onPlayClicked} value={name} onChange={(evt) => setName(evt.target.value)}/>
          </div>
          <Button style={{height: '3rem', marginLeft: '1rem'}} type={'primary'} onClick={onPlayClicked}>Play</Button>
        </div>
      </header>
    </div>
  );
}
