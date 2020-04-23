import React, {useContext} from "react";
import { AppContext } from "../contexts/AppContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from "../routes";
import Login from "./Login";
import Layout from "../layout/Layout";

const Initializer = () => {
  const [{ user }] = useContext(AppContext);

    if (user.id && user.name) {
      return (
          <Router>
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
    } else {
      return <Layout><Login /></Layout>
    }

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
