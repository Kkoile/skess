import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import routes from './routes'
import {AppContextProvider} from "./contexts/AppContext";
import axios from 'axios';

if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://localhost:5000/';
}

export default function App() {
  return (
      <Router>
          <AppContextProvider>
              <div>
                  <Switch>
                      {routes.map(route => {
                          return (
                              <RouteWrapper
                                  exact
                                  key={route.path}
                                  path={route.path}
                                  component={route.component}
                                  label={route.label}
                              />
                          )
                      })}
                  </Switch>
              </div>
          </AppContextProvider>
      </Router>
  );
}

const RouteWrapper = ({ component: Component, label, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => (
                <Component {...props} />
            )}
        />
    );
};