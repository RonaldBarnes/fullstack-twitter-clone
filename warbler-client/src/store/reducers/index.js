import { combineReducers } from "redux";

import currentUser from "./currentUser";
import errors from "./errors";
import messages from "./messages";


// Lecture 369 @ 08:05
const rootReducer = combineReducers({
	currentUser,
	errors,
	messages
	});

export default rootReducer;

