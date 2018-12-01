import React, { Component } from 'react'
import Tab from "./Tab.jsx"
import TabBar from "./TabBar.jsx";

export default class Tabs extends Component {
  render() {
    return (
      <div id='tabs'>
        <TabBar></TabBar>
        <Tab/>
      </div>
    )
  }
}
