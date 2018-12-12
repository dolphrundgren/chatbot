import React, { Component } from "react";

import "../styles/Bot.css";
import Typing from 'react-typing-animation';

class Bot extends Component {
  constructor(props){
    super(props)
    this.state = {
      sessionkey: null,
      input: "",
      messages: [],
      firstOpen: false
    };
    this.textMessage = React.createRef();
    this.scrollToRecentTextMessage = this.scrollToRecentTextMessage.bind(this); 
  }

  componentDidMount = () => {
    fetch('/api/utterances/openingStatement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(body => {
        this.recordMessage('BOT', body.Response.message)
        this.setState({ sessionkey: body.SessionKey })
      })
  }

  scrollToRecentTextMessage () {
    this.textMessage.current.scrollIntoView( {behavior: "smooth"} );
  }

  recordMessage = (sender, message) => {
    this.setState({
      messages: this.state.messages.concat({
        SENDER: sender,
        MESSAGE: message
      })
    })
    this.scrollToRecentTextMessage();
  }

  submitMessage = () => {
    let message = this.state.input;
    this.setState({ input: "" })
    this.recordMessage('USER', message)

    fetch('/api/utterances/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Message: message,
        SessionKey: this.state.sessionkey
      })
    }).then(res => res.json())
      .then(body => {
        this.recordMessage('BOT', body.Response.message)
    })
  }

  changeInput = e => {
    let input = e.target.value;
    this.setState({ input: input});
  };

  handleKeyPress = e => {
    (e.key === 'Enter') &&
    (this.state.input !== "") &&
    this.submitMessage();
  }


  render() {

    const messages = (
      <div className="messages">
          {
            this.state.messages.map((message, index) => {
              return (
                <div
                  ref={this.textMessage}
                  key={message.SENDER + index}
                  className={`message ${message.SENDER}`}>
                  {message.SENDER == 'BOT' 
                    ? <Typing speed={20} hideCursor onFinishedTyping = {() =>{this.setState({ firstOpen: true})}}>  <span> {message.MESSAGE} </span> </Typing>
                    : message.MESSAGE}
                </div> 
              )
            })
          }
      </div>
    )


    const input = (
      <div className= "inbox">
        <div className= {this.state.firstOpen ? "fadein" : "fadeout"}>
          <input
            autofocus= "true"
            value={this.state.input}
            onChange={this.changeInput}
            onKeyPress={this.handleKeyPress} />
        </div>
      </div>
    );

    return(
      <div className="WebCanvas">
        <div className="Bot">
          {messages}
        </div>
         {input}
        <div className="linebox1"></div>
        <div className="linebox2"></div>
        <div className="linebox3"></div>
        <div className="linebox4"></div>
        <div className="linebox5"></div>
        <div className="linebox6"></div>
        <div className="linebox7"></div>
      </div>
    );
  }
}

export default Bot;
