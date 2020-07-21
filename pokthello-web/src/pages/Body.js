// Copyright (c) 2020 Davide Gironi
// Please refer to LICENSE file for licensing information.

import React from 'react';

// load components
import Main from './Main/Main';

// load style
import s from './Body.module.css';

export default function Body() {
  return (
    <div className={s.content}>
      <header className={s.header}>
        <div className={s.logocontainer}>
          <div className={s.logo}>
            pOkTHELLO
          </div>
          <div className={s.logosub}>
            How would Shakespeare describe your pokemon?
          </div>
        </div>
      </header>
      <main className={s.main}>
        <Main />
      </main>
      <footer className={s.footer}>
        <div className={s.footertext}>
          <div>Copyright (&copy;) Davide Gironi, 2020</div>
          <a href="https://github.com/davidegironi/pokthello">https://github.com/davidegironi/pokthello</a>
        </div>
      </footer>
    </div>
  );
}
