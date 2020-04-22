import React from 'react';

import {AppContextProvider} from "./contexts/AppContext";
import Initializer from "./views/Initializer";

export default function App() {
  return (
      <AppContextProvider>
          <Initializer />
      </AppContextProvider>
  );
}