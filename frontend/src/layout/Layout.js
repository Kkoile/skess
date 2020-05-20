import React from 'react';
import './layout.css';
import {Button} from "antd";
import logo from '../assets/logo.svg';
import {useTranslation} from "react-i18next";

export default function ({children, history}) {

    const {t} = useTranslation('general');

    return (
        <div className={'layout-main'}>
            <img className={'layout-logo'} src={logo}></img>
            <div className={'layout-content'}>
                {children}
            </div>
            <div className={'layout-footer'}>
                <div className={'layout-inner-footer'}>
                    <div className={'layout-footer-links'}>
                        <Button type={'link'} onClick={() => history.push('/imprint')}>{t('imprint')}</Button>
                        <Button type={'link'} onClick={() => history.push('/dataPrivacyStatement')}>{t('dataPrivacyStatement')}</Button>
                    </div>
                    <p style={{color: '#e6e6e6', fontSize: '0.75rem', fontWeight: 'normal'}}>Made with ♥ by Kkoile</p>
                </div>
            </div>
        </div>
    );
}