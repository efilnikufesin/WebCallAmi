import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './App.css';
import Index from './Index';

class StartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callbackNum: '',
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: ''
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    console.log(data.callbackNum, this.props, this.state);
    fetch('token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())    //set invalid data here?
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username,
          callbacknNum: data.callbackNum,
        });
      });
    console.log('result', this.state);
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch('users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username
        });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    //let form;
    //switch (this.state.displayed_form) {
      //case 'login':
        //form = <LoginForm handle_login={this.handle_login} />;
        //break;
      //case 'signup':
        //form = <SignupForm handle_signup={this.handle_signup} />;
        //break;
      //default:
        //form = null;
        //form = <LoginForm handle_login={this.handle_login} />;
    //}

    const logged_out_nav = (
      <LoginForm handle_login={this.handle_login} />
    );

    const logged_in_nav = (<Index callbackNum={this.state.callbackNum}/>);

    return (
      <div className="App">
      {this.state.logged_in ? logged_in_nav : logged_out_nav}
      </div>
    );
  }
}

export default StartPage;
