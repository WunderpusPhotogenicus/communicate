import React, { Component } from 'react';
import Chatbox from "./Chatbox.jsx";
import MiniAppBox from "./MiniAppBox.jsx";

export default class FooterBar extends Component {
  render() {
    return (
      <div id='footer-bar'>
        <Chatbox/>
        <MiniAppBox/>
      </div>
    )
  }
}
