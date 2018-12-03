import React, { Component } from "react";

//creates a context for react components that can be accessed from anywhere
//that is inside of a usercontext provider "UserProvider"
//think of it like a store for redux

export const UserContext = React.createContext();

class UserProvider extends Component {
  state = {
    ID: {
      userID: "",
      roomID: "",
      username: "",
      appID: ""
    },
    otherID: [],
    wrtc: {

    }

  };
  render() {
    return (
      <UserContext.Provider
        value={{
          state: this.state
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;
