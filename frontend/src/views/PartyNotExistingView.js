import React from "react";
import './PartyNotExistingView.css';
import PrimaryButton from "../components/PrimaryButton";
import {useTranslation} from "react-i18next";

export default function PartyNotExistingView ({history, match}) {
    const {t} = useTranslation('partyLobby');

    const goToLobby = () => {
        history.replace('/');
    };

    return (
        <div className={'PartyNotExistingView'}>
            <h1>{t('partyNotExistingTitle')}</h1>
            <p>{t('partyNotExistingInfoText', {partyId: match.params.partyId})}</p>
            <PrimaryButton value={t('goToLobbyButton')} onClick={goToLobby} />
        </div>
    )
}