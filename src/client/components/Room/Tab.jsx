import React, { Component } from "react";
import Canvas from "./Canvas/Canvas.jsx";
import FooterBar from "./FooterBar/FooterBar.jsx";
import NavButton from '../Navigation/NavButton.jsx';

const appPlaceholder = { name: "placeholder" };

export default class Tab extends Component {
  // constructor(props){
  //   this.state = {
  //     apps: new Array(10).fill(appPlaceholder)
  //   }
  // }

  render() {
    return (
      <div className="tab">
        <div id="main-body">
          <Canvas />
        </div>
        <FooterBar />
        <NavButton words="Return to Login" path="/" />
      </div>
    );
  }
}
