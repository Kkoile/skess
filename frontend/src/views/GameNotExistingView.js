import React, {useContext} from "react";
import './GameNotExistingView.css';
import PrimaryButton from "../components/PrimaryButton";
import {useTranslation} from "react-i18next";
import {PartyContext} from "../contexts/PartyContext";

export default function GameNotExistingView ({history, match}) {
    const {party} = useContext(PartyContext);
    const {t} = useTranslation('game');

    const goToLobby = () => {
        history.replace(`/party/${party.id}`);
    };

    return (
        <div className={'GameNotExistingView'}>
            <h1>{t('gameNotExistingTitle')}</h1>
            <p>{t('gameNotExistingInfoText', {gameId: match.params.gameId})}</p>
            <PrimaryButton value={t('goToLobbyButton')} onClick={goToLobby} />
        </div>
    )
}