import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
  state = {
    username: '',
    password: '',
    callbackNum: '',
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
    <div id="loginForm">
      <form onSubmit={e => this.props.handle_login(e, this.state)}>
     <div className="inputForm">
        <input
          placeholder="username"
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handle_change}
        />
     </div>
     <div className="inputForm">
        <input
          placeholder="password"
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
        />
     </div>
     <div className="inputForm">
        <input
          placeholder="callback number"
          type="callbackNum"
          name="callbackNum"
          value={this.state.callbackNum}
          onChange={this.handle_change}
        />
     </div>
        <input type="submit" value="Log In" id="btn-login"/>
      </form>
    </div>
    );
  }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};

