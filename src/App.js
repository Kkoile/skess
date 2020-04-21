import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import routes from './routes'
import {AppContextProvider} from "./contexts/AppContext";

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