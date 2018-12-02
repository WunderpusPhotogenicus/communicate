import React from 'react'
import '../../css/login.css'

export default function Login() {
  return (
    <div id="login">
      <h3>Enter a Username:</h3>
      <input type="text"/>
      <button onClick={props.history.push('/lobby')}>Chat!</button>
    </div>
  )
}
