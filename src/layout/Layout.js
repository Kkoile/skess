import React, {useState} from 'react';
import './layout.css';
import {Button, Modal} from "antd";
import Impressum from "../views/Impressum";

export default function ({children}) {

    const [isImpressumShowing, setIsImpressumShowing] = useState(false);

    return (
        <div className={'layout-main'}>
            <div className={'layout-content'}>
                {children}
            </div>
            <Modal
                visible={isImpressumShowing}
                width={'60vw'}
                onCancel={() => setIsImpressumShowing(false)}
                footer={[
                    <Button type={'primary'} key={'ok'} onClick={() => setIsImpressumShowing(false)}>OK</Button>
                ]}
            >
                <div className={'layout-impressum-modal-content'}>
                    <Impressum/>
                </div>
            </Modal>
            <div className={'layout-footer'}>
                <div className={'layout-inner-footer'}>
                    <Button type={'link'} onClick={() => setIsImpressumShowing(true)}>Impressum</Button>
                    <p style={{color: '#e6e6e6', fontSize: '12px', fontWeight: 'normal'}}>Made with ♥ by Kkoile</p>
                </div>
            </div>
        </div>
    );
}