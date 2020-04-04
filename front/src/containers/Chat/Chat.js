import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button, Form, FormGroup, Input} from "reactstrap";
import {Redirect} from "react-router-dom";
import ReconnectingWebSocket from "reconnecting-websocket";


class Chat extends Component {
	state = {
		activeUsers: [],
		message: '',
		messages: []
	};


	componentDidMount() {
		let url = 'ws://localhost:8000/messenger';
		if (this.props.user) {
			url += `?token=${this.props.user.token}`
		}
		this.websocket = new WebSocket(url);

		this.websocket.onmessage = event => {
			const message = JSON.parse(event.data);
			switch (message.type) {
				case 'ACTIVE_USERS':
					this.setState({
						activeUsers: message.userNames
					});
					break;
				case 'NEW_USER':
					if (this.props.user && this.props.user._id === message.author.id) {
						return null
					} else {
						return this.setState({
							activeUsers: [
								...this.state.activeUsers,
								message.author
							]
						})
					}
				case 'LATEST_MESSAGES':
					console.log(message);
					this.setState({
						messages: message.messages
					});
					break;
				case 'RECEIVE_MESSAGE':
					this.setState({
						messages: [
							...this.state.messages,
							{message: message.message, author: message.author, datetime: message.datetime}
						]
					});
					break;
				default:
					break;
			}
		};
	}


	inputChangeHandler = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	sendMessage = event => {
		event.preventDefault();
		this.setState({message: ''});

		this.websocket.send(JSON.stringify({
			type: 'SEND_MESSAGE',
			message: this.state.message
		}));
	};

	render() {
		if(!this.props.user) return <Redirect to='/login'/>;
		return (
			<div >
				<div className="users">
					<h4>Online users:</h4>
					{
						this.state.activeUsers.map((author,index) => {
							return (
								<div key={index} >{<p>User: {author}</p> }</div>
							)
						})
					}
				</div>
				<Form inline onSubmit={(event) => this.sendMessage(event)}>
					<FormGroup>
						<Input type="text"  value={this.state.message} onChange={this.inputChangeHandler} name="message" placeholder="Enter your message" />
					</FormGroup>
					<Button type="submit" >Send</Button>
				</Form>
				<div className='chat'>
					<div className="messages" id="chat">
						{
							this.state.messages.map(message => (
								<p key={message.datetime}>
									<strong>{message.author}: </strong>{message.message}</p>
							))
						}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.users.user,
});


export default connect(mapStateToProps)(Chat);
