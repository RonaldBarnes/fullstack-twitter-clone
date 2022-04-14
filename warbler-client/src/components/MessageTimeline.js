
// Lecture 380 @ 03:30, brief intro
// Lecture 382 @ 00:00

import React from "react";
// We'll fetch a list of messages from *Redux*:
import MessageList from "../containers/MessageList";
import UserAside from "./UserAside";


const MessageTimeline = (props) => {
	return (
		<div className="row">
			{ /* UserAside Lecture 384 @ 03:10 */ }
			<UserAside
				profileImageUrl={props.profileImageUrl}
				author={props.username}
				/>
			<MessageList />
		</div>
		);	// end return
	};	// end MessageTimeline


function mapStateToProps(state)
	{
	console.log(`MessageTimeLine mapStateToProps() - why not run post-delete?`);
	return {
		messages: state.messages
		};
	}

export default MessageTimeline;
