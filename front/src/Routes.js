import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";
import Chat from "./containers/Chat/Chat";
import {useSelector} from "react-redux";

const ProtectedRoute = ({isAllowed, ...props}) => (
  isAllowed ? <Route {...props}/> : <Redirect to="/login"/>
);

const Routes = () => {
  const user = useSelector(state => state.users.user);

  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/register" exact component={Register}/>
      <Route path="/login" exact component={Login}/>
      <ProtectedRoute isAllowed={user} path="/chat" exact component={Chat} />
    </Switch>
  );
};

export default Routes;