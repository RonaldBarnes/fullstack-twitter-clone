
// Lecture 382 @ 00:20

import { apiCall } from "../../services/api";
import { addError } from "./errors";
import {
	LOAD_MESSAGES,
	DELETE_MESSAGE,
	REMOVE_MESSAGE,
	} from "../actionTypes";
// Attempt to route user back to "/" after posting new message, since
// useNavigate cannot be used in a Component, and I can't wrap component
// in a function AND use connect(mapStateToProps,...) - don't know how
//
// This doesn't work:
// Invalid hook call. Hooks can only be called inside of the body of
// a function component.
// postNewMessage() is NOT a function component and can't be made into one.
//
// import { useNavigate } from "react-router-dom";



export const loadMessages = (messages) => (
	{
	type: LOAD_MESSAGES,
	messages: messages
	}
	);

export const fetchMessages = () => {
	// another "thunk"
	return dispatch => {
		return apiCall("GET", "/api/messages")
			.then( (res) => {
				dispatch( loadMessages(res) );
				})
			.catch( (err) => {
				dispatch( addError(err));
				})
// Has something changed since Elie posted video?
// Did he post incorrect code?
// Who fucking knows?
//
// Elie's error: see Lecture 383 @ 09:34
//
// Uncaught (in promise) TypeError: dispatch(...).catch is not a function
// .catch( err => addError(err.message) )
//				)	// end .then
			};	// end dispatch #1
	};	// end fetchmessages



// Lecture 386 @ ~02:00 -> 03:05
export const postNewMessage = text => (dispatch, getState) => {
	let { currentUser } = getState();
	const id = currentUser.user.id;
//	const navigate = useNavigate();
	//
	return apiCall("POST", `/api/users/${id}/messages`, { text })
//		.then( (res) => {navigate("/") })
		.then( (res) => {})
		.catch( (err) => dispatch(addError(err.message) ))
		;
	};



// Lecture 387 @ 00:30
export const remove = (id) => {
	console.log(`store/actions/message.js remove() called after dispatch.then`,
		`id: ${id}`);
	return {
		type: DELETE_MESSAGE,
		id: id
		}
	};

/*
export const remove = (id) => (
	{
		type: DELETE_MESSAGE,
		id: id
	});
*/
//
// Lecture 387 @ 00:50
// thunk:
// NOTE: after deleting a message, my code does not update MessageList
// until page reloaded...
export const deleteMessage = (user_id, message_id) => {
	console.log(`store/actions/message.js deleteMessage()`,
		`\n user: ${user_id} \n message: ${message_id}`);
	return dispatch => {
		return apiCall("DELETE", `/api/users/${user_id}/messages/${message_id}`)
			.then( () => {
				console.log(`store/actions/message.js deleteMessage .THEN`,
					`message_id: ${message_id}`);
				dispatch(remove(message_id))
				return message_id;
				})
			.catch( (err) => {
				console.log(`actions/message.js deleteMessage() catch ${err}`);
				dispatch(addError(err.message))
				return err;
				})
			;
		}
	}

