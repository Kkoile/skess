import React, {useContext} from "react";
import { AppContext } from "../contexts/AppContext";
import { Router, Route, Switch } from "react-router-dom";
import routes from "../routes";
import Login from "./Login";
import Layout from "../layout/Layout";
import PiwikReactRouter from 'piwik-react-router';
import history from "../history";

const Initializer = () => {

  let historyToUse = history;
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
      const matomo = PiwikReactRouter({
        url: 'https://analytics.kkoile.de/',
        siteId: 1
      });
      matomo.push(['disableCookies']);
      historyToUse = matomo.connectToHistory(history);
  }

  return (
      <Router history={historyToUse}>
        <Switch>
          {routes.map((route, i) => {
            return (
                <RouteWrapper
                    exact
                    key={i}
                    path={route.path}
                    component={route.component}
                    label={route.label}
                />
            )
          })}
        </Switch>
      </Router>
  )

};

const RouteWrapper = ({ component: Component, label, ...rest }) => {
  return (
      <Route
          {...rest}
          render={props => (
              <Layout>
                <Component {...props} />
              </Layout>
          )}
      />
  );
};

export default Initializer;
