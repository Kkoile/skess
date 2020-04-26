import React from 'react';

import {AppContextProvider} from "./contexts/AppContext";
import Initializer from "./views/Initializer";
import {PartyContextProvider} from "./contexts/PartyContext";

export default function App() {
  return (
      <AppContextProvider>
          <PartyContextProvider>
            <Initializer />
          </PartyContextProvider>
      </AppContextProvider>
  );
}