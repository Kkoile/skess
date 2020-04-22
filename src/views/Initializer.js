import React, {useContext} from "react";
import { AppContext } from "../contexts/AppContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from "../routes";
import Login from "./Login";

const Initializer = () => {
  const [{ user }] = useContext(AppContext);

    if (user.id && user.name) {
      return (
          <Router>
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
          </Router>
      )
    } else {
      return <Login />
    }

};

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

export default Initializer;
