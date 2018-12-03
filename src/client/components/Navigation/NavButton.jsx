import React from "react";
import { Link } from "react-router-dom";
// import XHRRequest from './XHRRequest.js';
import UserConsumer from "../UserContext.jsx";

const NavButton = props => {
  const thing = (butt) => {
    console.log(butt);
  };
  return (
    <span>
      <UserConsumer>
        {context}=>(
        <Link to={props.path}>
          <button onClick={thing(context.state.ID)}>{props.words}</button>
        </Link>
        )
      </UserConsumer>
    </span>
  );
};

export default NavButton;
