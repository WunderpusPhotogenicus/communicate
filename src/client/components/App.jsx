import React, { Component } from "react";
import { BrowserRouter,Route, Switch } from "react-router-dom";
import ContextRoute from "./ContextRoute.jsx";
import Room from "./Room/Room.jsx";
import Login from "./Login/Login.jsx";
import Lobby from "./Lobby/Lobby.jsx";
import NotFound from "./NotFound.jsx";

export default class App extends Component {


  render() {
    return (
      <BrowserRouter>
        <Switch>
          <ContextRoute
            exact
            path="/"
            component={Login}
          />
          <ContextRoute
            exact
            path="/lobby"
            component={Lobby}
          />
          <ContextRoute
            exact
            path="/room"
            component={Room}
          />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}
