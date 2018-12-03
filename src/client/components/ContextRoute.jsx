import React from "react";
import { Route } from "react-router-dom";
import {UserProvider} from './UserContext.jsx'


//this is a way to pass the UserContext down through each of the routes so that 
//it can be accessed from anywhere in the document, goes in between the 
//is used instead of <Route/>, pass in the context and the component that needs
//to be called

const ContextRoute = ({ component, ...rest }) => {
  const Component = component;

  return (
    <Route {...rest}>
      <UserProvider>
        <Component />
      </UserProvider>
    </Route>
  );
};


export default ContextRoute;