import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Cookies from 'universal-cookie';

class IncomingCalls extends Component {

  static defaultProps = {
  CallerID: '',
  Channel: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      answered: false,
    };
  }


    audio = new Audio('static/frontend/ring.mp3')
    componentDidMount() {
      this.audio.loop = true
      this.audio.play()
    }

    componentWillUnmount() {
      this.audio.pause();  
    }

    answer = e => {
    this.setState({
      answered: true
      })
    const cookies = new Cookies();
    fetch("answerCall/", {
      method: 'post',
      headers: {"Content-Type":"application/json", "Authorization": `JWT ${localStorage.getItem('token')}`, "X-CSRFToken": cookies.get("csrftoken")},
      body: JSON.stringify({
        "channel": this.props.Channel,
        })
     });
  }


  render() {

  const {answer} = this;

    return (

      <div className="event-handler">
                 {this.props.CallerID} <button id="answer-btn" onClick={answer} value="Answer call"></button>
      </div>
    )

  }
}

export default IncomingCalls;
