import React from "react";
import {Link} from 'react-router-dom'

const ButtonToRoom = (props)=>{
  return (
    <span>
      <Link to={props.path}>
        <button onClick={console.log("butt")}>{props.words}</button>
      </Link>
    </span>
  );
}

export default ButtonToRoom;
