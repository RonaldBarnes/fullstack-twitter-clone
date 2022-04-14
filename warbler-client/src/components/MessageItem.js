
// Lecture 383 @ 04:15

import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import DefaultProfileImage from "../images/default-profile-image.jpg";
// Deleting message doesn't redirect to fresh list: state not propogating
// or some stupid fucking thing, I dunno.


const MessageItem = (
		{
		date,
		profileImageUrl,
		text,
		author,
		deleteMessage,
		currentUser
		}) => {
	console.log(`MessageItem currentUser:`, currentUser,
		`author: ${author}`);
	return (
		<div>
			{ /* <li> added Lecture 384 @ 02:30 */ }
			<li className="list-group-item">
				<img	src={profileImageUrl || DefaultProfileImage}
							alt={author}
							height="100"
							width="100"
							className="timeline-image"
							/>
				<div className="message-area">
					<Link to="/">@{author} &nbsp;</Link>
					<span className="text-muted">
						<Moment className="text-muted" format="YYYY/MM/DD">
							{date}
						</Moment>
					</span>
					<p>{text}</p>
					{ /*	Lecture 387 @ 03:42	*/ }
					{ (author === currentUser) && (
						<a className="btn btn-danger" onClick={deleteMessage}>
							Delete Message
						</a>
						)}
				</div>
			</li>
		</div>
		);	// end return
	};	// end MessageItem


export default MessageItem;
