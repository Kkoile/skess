import React, {useState} from 'react';
import './layout.css';
import {Button, Modal} from "antd";
import Impressum from "../views/Impressum";
import logo from '../assets/logo.svg';
import DataPrivacy from "../views/DataPrivacy";
import {useTranslation} from "react-i18next";

export default function ({children}) {

    const [isImpressumShowing, setIsImpressumShowing] = useState(false);
    const [isDataPrivacyShowing, setIsDataPrivacyShowing] = useState(false);

    const {t} = useTranslation('general');

    return (
        <div className={'layout-main'}>
            <img className={'layout-logo'} src={logo}></img>
            <div className={'layout-content'}>
                {children}
            </div>
            <Modal
                visible={isImpressumShowing}
                width={'60vw'}
                style={{top: '0rem', marginTop: '1rem', marginBottom: '1rem'}}
                onCancel={() => setIsImpressumShowing(false)}
                footer={[
                    <Button type={'primary'} key={'ok'} onClick={() => setIsImpressumShowing(false)}>OK</Button>
                ]}
            >
                <div className={'layout-modal-content'}>
                    <Impressum/>
                </div>
            </Modal>
            <Modal
                visible={isDataPrivacyShowing}
                width={'60vw'}
                style={{top: '0rem', marginTop: '1rem', marginBottom: '1rem'}}
                onCancel={() => setIsDataPrivacyShowing(false)}
                footer={[
                    <Button type={'primary'} key={'ok'} onClick={() => setIsDataPrivacyShowing(false)}>OK</Button>
                ]}
            >
                <div className={'layout-modal-content'}>
                    <DataPrivacy/>
                </div>
            </Modal>
            <div className={'layout-footer'}>
                <div className={'layout-inner-footer'}>
                    <div className={'layout-footer-links'}>
                        <Button type={'link'} onClick={() => setIsImpressumShowing(true)}>{t('imprint')}</Button>
                        <Button type={'link'} onClick={() => setIsDataPrivacyShowing(true)}>{t('dataPrivacyStatement')}</Button>
                    </div>
                    <p style={{color: '#e6e6e6', fontSize: '0.75rem', fontWeight: 'normal'}}>Made with ♥ by Kkoile</p>
                </div>
            </div>
        </div>
    );
}