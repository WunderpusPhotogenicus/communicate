import React, { Component } from "react";
import Canvas from "./Canvas/Canvas.jsx";
import FooterBar from "./FooterBar/FooterBar.jsx";
import NavButton from "../Navigation/NavButton.jsx";
// import VidClient from "../../javascript/VidClient.js";
import { UserContext } from "../UserContext.jsx";

class Tab extends Component {
  componentDidMount() {
    // VidClient.getHost();
    let value = this.props.state;
    console.log(value);
  }

  render() {
    return (
      <div className="tab">
        <div id="main-body">
          <Canvas />
        </div>
        <FooterBar />
        <NavButton
          words="Return to Login"
          function={() => console.log("i need a wrtc function")}
          path="/"
        />
      </div>
    );
  }
}
export default props => (
  <UserContext.Consumer>
    {context => {
      return <Tab state={context.state} />;
    }}
  </UserContext.Consumer>
);

// export default Tab;
