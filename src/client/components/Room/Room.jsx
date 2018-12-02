import React from "react";
import Tabs from "./Tabs.jsx";
import "../../css/main.css";
import Users from "./UserWindow/Users.jsx";

export default function Room() {
  return (
    <div id="app">
      <Tabs />
      <Users />
    </div>
  );
}
