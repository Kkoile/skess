import React from 'react';
import './DataPrivacy.css';
import {useTranslation} from "react-i18next";

export default function DataPrivacy() {

    const {t, i18n} = useTranslation('dataPrivacy');

    return (
    <div className="DataPrivacy">
        <h2>{t('dp1')}</h2>

        <h4>{t('dp2')}</h4>

        <p>{t('dp3')}</p>

        <p>{t('dp4')}</p>

        <p>{t('dp5')}</p>

        <p>{t('dp6')}</p>

        <h4><strong>{t('dp7')}</strong></h4>

        <p>{t('dp8')}</p>

        <p>{t('dp9')}</p>

        <p>{t('dp10')}</p>

        <p><strong>Nils Hirsekorn IT</strong></p>

        <p>Prozessionsweg 40, 48712 Gescher</p>

        <p>Telefon: +49 (0) 176 64165493</p>

        <p>Email: info@skess.de</p>

        <p>{t('dp11')}</p>

        <p></p>

        <h4><strong>{t('dp12')}</strong></h4>

        <p>{t('dp13')}</p>

        <p></p>

        <h4><strong>{t('dp14')}</strong></h4>

        <p>{t('dp15')}</p>

        <p></p>

        <h4><strong>{t('dp16')}</strong></h4>

        <p><strong>{t('dp17')}</strong></p>

        <p>{t('dp18')}</p>

        <h4><strong>{t('dp19')}</strong></h4>

        <p>{t('dp20')}</p>

        <p>{t('dp21')}</p>

        <p>{t('dp22')}</p>

        <p>{t('dp23')}</p>

        <p></p>

        <h4></h4>

        <h4><strong>Matomo</strong></h4>

        <p><strong>{t('dp24')}</strong></p>

        <iframe
            style={{border: 0, height: '200px', width: '600px'}}
            src={`https://analytics.kkoile.de/index.php?module=CoreAdminHome&action=optOut&language=${i18n.language.split('-')[0]}&backgroundColor=&fontColor=&fontSize=&fontFamily=`}
        ></iframe>

        <h4 id="warum-matomo-cookiefrei">{t('dp25')}</h4>
        <p>{t('dp26')}</p>
        <p>{t('dp27')}<a className="wpel-icon-right"
                                href="https://www.baden-wuerttemberg.datenschutz.de/faq-zu-cookies-und-tracking-2/"
                                target="_blank" rel="noopener external noreferrer" data-wpel-link="external">{t('dp28')}</a>{t('dp29')}</p>

        <p><strong>{t('dp30')}</strong></p>

        <p>{t('dp31')}</p>

        <p>{t('dp32')}</p>

        <h3><strong>{t('dp33')}</strong></h3>

        <p>{t('dp34')}</p>

        <p>{t('dp35')}</p>

        <p>{t('dp36')}</p>

        <h3><strong>{t('dp37')}</strong></h3>

        <h4><strong>{t('dp38')}</strong></h4>

        <p><strong>{t('dp39')}</strong></p>

        <p>{t('dp40')}</p>

        <p><strong>{t('dp41')}</strong></p>

        <p>{t('dp42')}</p>

        <p><strong>{t('dp43')}</strong></p>

        <p>{t('dp44')}</p>

        <p>{t('dp45')}</p>

        <p><strong>{t('dp46')}</strong></p>

        <p>{t('dp47')}</p>

        <p><strong>{t('dp48')}</strong></p>

        <p>{t('dp49')}</p>

        <p></p>

        <h4><strong>{t('dp50')}</strong></h4>

        <p>{t('dp51')}</p>

        <p>{t('dp52')}</p>

        <p><strong>{t('dp53')}</strong></p>

        <p>{t('dp54')}</p>

        <ul>
            <li>{t('dp55')}</li>
            <li>{t('dp56')}</li>
            <li>{t('dp57')}</li>
            <li>{t('dp58')}</li>
        </ul>

        <p>{t('dp59')}</p>

    </div>
  );
}
