import React, { Component } from 'react'
import Canvas from './Canvas/Canvas.jsx';
import Users from './UserWindow/Users.jsx';
import FooterBar from './FooterBar/FooterBar.jsx';

export default class Tab extends Component {
  
  render() {
    return (
      <div>
        <Users/>
        <Canvas />
        <FooterBar />
      </div>
    )
  }
}
