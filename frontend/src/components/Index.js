import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Cookies from 'universal-cookie';
import openSocket from 'socket.io-client';
import IncomingCalls from './IncomingCalls';

class Index extends Component {

  static defaultProps = {
//    choice: "",
//    isLogin: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      answered: false,
      eventLoaded: false,
      event,
      stopPoll: false,
      isDrop: true,
      phones: [],
      loaded: false,
      prevchoice: "",
      isLoading: true,
      choice: "unset",
      activeBar: "active",
      showSuggestions: false,
      userInput: "",
      activeBarCreate: "active",
    };
  }

  createNewContact = e => {
  fetch("api/contacts/?create", {
    method: 'post',
    headers: {
              "Content-Type": "application/json",
              "Authorization": `JWT ${localStorage.getItem('token')}`
             },
              body: {
                     "name": this.state.Name,
                     "number_primary": this.state.nPrimary,
                     "number_secondary": this.state.nSecondary,
                     "number_additional": this.state.nAdditional,
             }
        });
  };

  loadPhones = e => {
    fetch("api/contacts/?view=" + e, {
      headers: {
        "Authorization": `JWT ${localStorage.getItem('token')}`
        }
      })
    .then(response => response.json())
    .then(items => items.forEach((item, index, array) =>{
      const phoneList = [item.number_primary, item.number_secondary, item.number_additional];
      this.setState({
        phones: phoneList, isLoading: true, loaded: true});
      })
    );
   };

  loadContacts = e => {
    if (e!==""){
      const name = [];
      fetch("api/contacts/?q=" + this.state.userInput, {
        headers: {
          "Authorization": `JWT ${localStorage.getItem('token')}`
        }
      })
     .then(response => { 
       if (response.status == 401) {
         localStorage.removeItem('token');
         window.location.reload();
         } else {
           return response.json()
           }
      })
  .then(data => {
    if (data.length) {
      data.forEach((item, index, array) => {
        name.push(item.name);
        this.setState({
          suggestions: name, 
          stopPoll: true, 
          isDrop: true
        })
       })
      } else {
        this.setState({
          suggestions: undefined, 
          stopPoll: true, 
          isDrop: true
          })
        }
      }
  )}
  };

  subscribeToEvt = socket => {
    console.log('subscribing');
    socket.on('eventClient', event => {
      if ((event.Exten !== 's') && (event.Event == 'Newchannel')) {
        this.setState({
          event: event,
          eventLoaded: true,
          answered: false,
        });
        console.log(this.state.event, 'EVENT')
        }
      });
      }

  componentDidMount() {
  if (this.state.userInput != ""){
    this.loadContacts(this.state.userInput);
    this.loadPhones(this.state.choice);
    } else { console.log('didmount statement failed', this.props);
      const  socket = openSocket('http://178.62.229.130:8000');
      this.subscribeToEvt(socket);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDrop==false) {
      this.loadContacts(this.state.userInput);
    }
    if (this.state.isLoading==false) {
      this.loadPhones(this.state.choice);
    }
  }

  onChange = e => {
    const userInput = e.currentTarget.value;

    this.setState({
      stopPoll: true,
      isDrop: false,
      activeBar: "active",
      //activeSuggestion: 0,
      showSuggestions: true,
      userInput: e.currentTarget.value,
      });
    console.log(this.props, 'test');
  }

  showBarCreate = e => {
    if (this.state.activeBarCreate == "active") {
      this.setState({
        activeBarCreate: ""
      })
    } else {
      this.setState({
        activeBarCreate: "active"})
    }
  }

  logOut = e => {
  localStorage.removeItem('token');
  window.location.reload();
  }

  showBar = e => {
    if (this.state.activeBar == "active") {
      this.setState({
        activeBar: ""
        })
    } else {
        this.setState({
          activeBar: "active"
          })
    }
  }

  createContact = e => {
    this.setState({
      Name: '',
      nPrimary: '',
      nSecondary: '',
      nAdditional: '',
    })
  }

  onClickCreate = e => {
    console.log('Create click');
    this.setState({
      activeBarCreate: "",
      });
 }

  onClick = e => {
    const prevchoice = this.state.choice;
    const text = e.currentTarget.textContent;
    this.setState({
      prevchoice,
      isLoading: false,
      choice: text,
      activeBar: "",
      })
  };

  callIt = e => {
  const cookies = new Cookies();
    fetch("call/", {
      method: 'post',
      headers: {"Content-Type":"application/json", "Authorization": `JWT ${localStorage.getItem('token')}`, "X-CSRFToken": cookies.get("csrftoken")},
      body: JSON.stringify({
        "callDigs": e.currentTarget.textContent,
        })
   });
  };



  render() {

    const {
      fetchPhones,
      onChange,
      onClick,
      callIt,
      onKeyDown,
      onBlur,
      onClickCreate,
      showBarCreate,
      showBar,
      logOut,
      state: {
        suggestions,
        stopPoll,
        isDrop,
        choice,
        loaded,
        isLoading,
        phones,
        activeBar,
        activeBarCreate,
        showSuggestions,
        userInput,
      }
    } = this;


    let suggestionsListComponent;
    let phonesListComponent;
    let rring = new Audio('static/frontend/ring.mp3');
    let eventPoller;

    if (this.state.eventLoaded == true) {
      eventPoller = (
        <IncomingCalls CallerID={this.state.event.CallerIDNum} Channel={this.state.event.Channel} />
      )
    }
    

      if (showSuggestions) {
      if (typeof this.state.suggestions!='undefined') {
        suggestionsListComponent = (
          <ul className="suggestions">
            {this.state.suggestions.map((suggestion, index) => {
              let className;
              let id = index;
              //if (index === activeSuggestion) {
                //className = "suggestion-active";
              //}

              return (
                <li className={className} key={index} onClick={this.onClick.bind(this)}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      }
      if (loaded == true){
      phonesListComponent = (
      <ul className="phones">
        {this.state.phones.map((phone, index) => {
          let id;
          id = index;
        if (phone){
        return (
          <li onClick={callIt} id={id} key={id}>
          <img className="fit-call"
           src="static/frontend/call.png"
           alt="call image"/>
        {phone}</li>
        )}}
      )}
     </ul>
    )}
   }

    return (
      <Fragment>
  { eventPoller }
  <div className="wrapper">
        <nav id="sidebar" className={this.state.activeBar}>
                   <h3>Contact info</h3>
               {phonesListComponent}
            <ul className="list-unstyled CTAs">
                <li>
                    <a href="#" className="article" onClick={logOut}>Back to login</a>
                </li>
            </ul>
        </nav>
    <div id="content">
        <nav className="navbar">
                <div className="container-fluid">
                        <button type="button" id="sidebarCollapse" className="btn btn-info" onClick={showBar}>
                                <i className="fas fa-align-left"></i>
                                <span>Toggle Search Results</span>
                        </button>
                        <input
          type="text"
          onChange={onChange}
          value={userInput}
        />
                        <button type="button" id="sidebarAddcontactCollapse" className="btn btn-info" onClick={showBarCreate}>
                                <i className="fas fa-align-right"></i>
                                <span>Create contact<sup>beta</sup></span>
                        </button>
                </div>

        </nav>
   {suggestionsListComponent}
  </div>
  <nav id="sidebarAddcontact" className={this.state.activeBarCreate}>
                   <h3>Create / Edit</h3>
            <ul className="list-unstyled CTAs">
                <li>
                    <a href="#" className="article">Back to login</a>
                </li>
            </ul>
        </nav>

 </div>
      </Fragment>
    );
  }
}

export default Index;
