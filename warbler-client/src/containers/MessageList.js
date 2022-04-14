
// Lecture 380 @ 04:25
// Lecture 382 @ 00:00

// Lecture 383 @ 00:45 -> 04:09
import React, { Component } from "react";
import { connect } from "react-redux";
import {
	fetchMessages,
	// Lecture 387 @ 03:05
	deleteMessage
	} from "../store/actions/messages";
import MessageItem from "../components/MessageItem";

class MessageList extends Component
	{
	constructor(props)
		{
		super(props);
		}

	componentDidMount()
		{
		console.log(`MessageList componentDidMount() this.props:`, this.props);
		this.props.fetchMessages();
		}

	render()
		{
		const { messages, deleteMessage, currentUser } = this.props;
		let messageList = messages.map(m => (
			<MessageItem
				key={m._id}
				date={m.createdAt}
				author={m.user.username}
				text={m.text}
				profileImageUrl={m.user.profileImageUrl}
				// Lecture 387 @ 03:11
				deleteMessage={deleteMessage.bind(this, m.user._id, m._id)}
				currentUser={currentUser.user.username || "ME"}
				/>
			));
		// Lecture 383 @ ~00:00 for styling, return() added previously
		return (
			<div className="row col-sm-8">
				<div className="offset-1 col-sm-10">
					<ul className="list-group" id="messages">
						{messageList}
					</ul>
				</div>
			</div>
			);	// end return
		}	// end render
	}	// end MessageList




function mapStateToProps(state)
	{
	console.log(`MessageList mapStateToProps() state:`, state);
	return { messages: state.messages, currentUser: state.currentUser };
	}


// Lecture 387 @ 04:52 -> Forgot to add deleteMessage into mapDispatchToProps
// Lecture 387 @ 05:13 -> Don't forget to destructure it in render() props
export default connect(mapStateToProps,
	{
	fetchMessages,
	deleteMessage
	})(MessageList);
