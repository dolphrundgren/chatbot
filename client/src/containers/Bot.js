import React, { Component } from "react";

import "../styles/Bot.css";

class Bot extends Component {
  state = {
    sessionkey: null,
    input: "",
    messages: []
  };

  componentDidMount = () => {
    fetch('/api/utterances/firstOpen', {
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

  recordMessage = (sender, message) => {
    this.setState({
      messages: this.state.messages.concat({
        SENDER: sender,
        MESSAGE: message
      })
    })
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
        <div className="messages-inner">
          {
            this.state.messages.map((message, index) => {
              return (
                <div
                  key={message.SENDER + index}
                  className={`message ${message.SENDER}`}>
                  {message.MESSAGE}
                </div>
              )
            })
          }
        </div>
      </div>
    )

    const input = (
      <div className="input-container">
        <input
          value={this.state.input}
          onChange={this.changeInput}
          onKeyPress={this.handleKeyPress} />
      </div>
    );

    return(
      <div className="Bot">
        {messages}
        {input}
      </div>
    );
  }
}

export default Bot;
