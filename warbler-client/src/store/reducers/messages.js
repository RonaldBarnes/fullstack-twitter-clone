
// Lecture 382 @ 02:44

import {
	LOAD_MESSAGES,
	DELETE_MESSAGE,
	REMOVE_MESSAGE
	} from "../actionTypes";

export default (state = [], action) => {
	switch(action.type)
		{
		case LOAD_MESSAGES:
			return [...action.messages];
		// Lecture 387 @ 02:30
		case REMOVE_MESSAGE:
		case DELETE_MESSAGE:
			return state.filter(message => message._id !== action.id)
		default:
			return state;
		}
	};

