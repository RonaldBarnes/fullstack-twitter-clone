
// This file created in Lecture 369 @ 04:00

import { SET_CURRENT_USER } from "../actionTypes";

const DEFAULT_STATE = {
	isAuthenticated: false,
	user: {} // All user info once logged in
	};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				// turn an empty object into false or, if keys, true:
				// Elie spent 1½ milliseconds describing different ways of determining
				// true or false: he settled on !! method.
				// Lecture 369 @ 05:30
				// First typed this code:
				// isAuthenticated: Object.keys(action.user).length > 0,
				// Then switched to this after discussing strategy & styles:
				isAuthenticated: !!Object.keys(action.user).length,
				// isAuthenticated: Boolean(Object.keys(action.user).length),
				// isAuthenticated: Object.keys(action.user).length > 0,
				user: action.user
				};
		default:
			return state;
		}
	};

