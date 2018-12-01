import React, { Component } from "react";
import Tabs from "./Tabs.jsx"
import '../main.css'
import Users from "./UserWindow/Users.jsx"

export default class App extends Component {
  render() {
    return (
      <div id = 'app'>
        <Tabs />
        <Users/>
      </div>
    )
  }
}
