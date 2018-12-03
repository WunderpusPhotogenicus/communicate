import React from "react";
import { Link } from "react-router-dom";
// import XHRRequest from './XHRRequest.js';
import { UserContext } from "../UserContext.jsx";

const NavButton = props => {
  return (
    <span>
      <UserContext.Consumer>
        {context => (
          <React.Fragment>
            <Link to={props.path}>
              <button onClick={props.function(context)}>
                {props.words}
              </button>
            </Link>
          </React.Fragment>
        )}
      </UserContext.Consumer>
    </span>
  );
};

export default NavButton;
