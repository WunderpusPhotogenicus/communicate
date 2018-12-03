import React from "react";

//creates a context for react components that can be accessed from anywhere
//that is inside of a usercontext provider "UserProvider"
//think of it like a store for redux

const UserContext = React.createContext({
  state: {
    ID: {
      username: "",
      socketID: "",
      roomID: "",
      appID: ""
    },
    otherID: []
  },

  setID: (username, socketID, roomID, appID) => {
    this.state.ID = {
      username: username,
      socketID: socketID,
      roomID: roomID,
      appID: appID
    };
  }
});

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
