import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import routes from "../routes";
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
                    layout={route.layout || Layout}
                />
            )
          })}
        </Switch>
      </Router>
  )

};

const RouteWrapper = ({ component: Component, layout: Layout, label, ...rest }) => {
  return (
      <Route
          {...rest}
          render={props => (
              <Layout history={props.history}>
                <Component {...props} />
              </Layout>
          )}
      />
  );
};

export default Initializer;
