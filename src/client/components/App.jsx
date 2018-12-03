import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ContextRoute from "./ContextRoute.jsx";
import Room from "./Room/Room.jsx";
import Login from "./Login/Login.jsx";
import Lobby from "./Lobby/Lobby.jsx";
import NotFound from "./NotFound.jsx";
// import VidClient from "../javascript/VidClient.js";

export default class App extends Component {
  render() {
    // VidClient.getHost();

    return (
      <BrowserRouter>
        <Switch>
          <ContextRoute exact path="/" component={Login} />
          <ContextRoute exact path="/lobby" component={Lobby} />
          <ContextRoute exact path="/room" component={Room} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}
