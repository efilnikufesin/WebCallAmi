import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './App.css';
import Index from './Index';
import Cookies from 'universal-cookie';

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
    const cookies = new Cookies();
    e.preventDefault();
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
        fetch('session/', {
        method: 'POST',
        headers:
        {"Content-Type":"application/json", "Authorization": `JWT ${json.token}`, "X-CSRFToken": cookies.get("csrftoken")},
        body: JSON.stringify({'callbackNum':data.callbackNum})
        });
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username,
          callbackNum: data.callbackNum,
        });
      });
    //fetch('session/', {
      //  method: 'POST',
        //headers: 
       // {"Content-Type":"application/json", "Authorization": `JWT ${localStorage.getItem('token')}`},
       // body: JSON.stringify({'callbackNum':data.callbackNum})
   // });
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


//   if (this.state.callbackNum !==''){
//   const logged_in_nav = (<Index callbackNum={this.state.callbackNum}/>);
//   }

    const logged_in_nav = (<Index callbackNum={this.state.callbackNum}/>);

//  {this.state.logged_in ? logged_in_nav : logged_out_nav}

//     let ifLog;

//     if (this.state.logged_in == true) {
 //    ifLog = (<Index callbackNum={this.state.callbackNum}/>)
   //  } else {
    // ifLog = logged_out_nav
     //}


    return (
      <div className="App">
      {this.state.logged_in ? logged_in_nav : logged_out_nav}
      </div>
    );
  }
}

export default StartPage;
