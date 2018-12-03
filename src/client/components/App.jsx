import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Room from "./Room/Room.jsx";
import Login from "./Login/Login.jsx";
import Lobby from "./Lobby/Lobby.jsx";
import NotFound from "./NotFound.jsx";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} exact/>
          <Route path="/lobby" component={Lobby} />
          <Route path="/room" component={Room} />
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    );
  }
}
