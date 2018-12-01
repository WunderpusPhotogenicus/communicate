import React, { Component } from "react";

export default class User extends Component {
  render() {
    //this should only contain one user
    //currently left like this to keep react from reloading in the event that the state is changed
    return (
      <div>
        <h3>You</h3>
        <div className="video-container">
          <video id="user-1" class="video" autoplay="" playsinline="" muted="" />
        </div>
        <h3>Other Person</h3>
        <div className="video-container">
          <video id="user-2" class="video" autoplay="" playsinline="" muted="" />
        </div>
      </div>
    );
  }
}
