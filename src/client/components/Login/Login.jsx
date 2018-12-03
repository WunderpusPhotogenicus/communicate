import React from "react";
import "../../css/login.css";
import NavButton from "../Navigation/NavButton.jsx";
// import VidClient from "../../javascript/VidClient.js";

export default function Login() {
  //send username information to server in the onClick function
  return (
    <div id="login">
      <h3>Enter a Username:</h3>
      <input type="text" />
      <NavButton
        words="Chat!"
        function={() => console.log("i need a wrtc function")}
        path="/lobby"
      />
    </div>
  );
}
