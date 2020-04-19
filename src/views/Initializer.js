import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Initializer = ({ history }) => {
  const [{ user }] = useContext(AppContext);

  if (user.id && user.name) {
    history.replace("/lobby");
  } else {
    history.replace("/login");
  }

  return <div>Loading ...</div>;
};

export default Initializer;
