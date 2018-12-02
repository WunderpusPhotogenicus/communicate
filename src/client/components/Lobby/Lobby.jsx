import React from "react";
import "../../css/lobby.css";
import LobbyUsers from "./LobbyUsers.jsx";
import NavButton from "../Navigation/NavButton.jsx";

export default function Lobby() {
  //send information in the button onclick
  return (
    <div id="lobby">
      <LobbyUsers />
        <NavButton words="Select User" path="/room" />
        <NavButton words="Go Back" path="/" />
    </div>
  );
}
