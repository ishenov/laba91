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
		let url = 'ws://localhost:8000/chat';
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
					this.setState({
						messages: message.messages.reverse()
					});
					break;
				case 'RECEIVE_MESSAGE':
					this.setState({
						messages: [
							...this.state.messages,
							message.message
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

		this.websocket.send(JSON.stringify({
			type: 'CREATE_MESSAGE',
			author: this.props.user.username,
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
						this.state.activeUsers.map(author => {
							return (
								<div key={author.id} >{<p>User: {author.username}</p> }</div>
							)
						})
					}
				</div>
				<div className='chat'>
					<div className="messages" id="chat">
						{
							this.state.messages.map(author => (
								<p key={author.datetime}>
									<strong>{author.author}: </strong>{author.message}</p>
							))
						}
					</div>
					<Form inline onSubmit={(event) => this.sendMessage(event)}>
						<FormGroup>
							<Input type="text"  value={this.state.message} onChange={this.inputChangeHandler} name="message" placeholder="Enter your message" />
						</FormGroup>
						<Button type="submit" >Send</Button>
					</Form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.users.user,
});


export default connect(mapStateToProps)(Chat);