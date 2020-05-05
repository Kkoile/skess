import React, {useContext} from "react";
import './NotPartOfGameView.css';
import PrimaryButton from "../components/PrimaryButton";
import {useTranslation} from "react-i18next";
import {PartyContext} from "../contexts/PartyContext";

export default function NotPartOfGameView ({history}) {
    const {party} = useContext(PartyContext);
    const {t} = useTranslation('game');

    const goToLobby = () => {
        history.replace(`/party/${party.id}`);
    };

    return (
        <div className={'NotPartOfGameView'}>
            <h1>{t('notPartOfGameTitle')}</h1>
            <p>{t('notPartOfGameInfoText')}</p>
            <PrimaryButton value={t('goToLobbyButton')} onClick={goToLobby} />
        </div>
    )
}