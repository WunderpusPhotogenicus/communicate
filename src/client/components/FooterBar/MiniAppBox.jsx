import React from "react";
import MiniAppButton from "./MiniAppButton.jsx";

export default function MiniAppBox(props) {
  // const apps = [];
  // this.props.apps.forEach(el => {
  //   apps.push(<MiniAppButton name={el.name} />);
  // });
  return (<div id="mini-app-box">
  <MiniAppButton/>
  <MiniAppButton/>
  <MiniAppButton/>
  <MiniAppButton/>
  <MiniAppButton/>
  
  </div>);
}
