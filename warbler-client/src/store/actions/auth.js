
import { apiCall } from "../../services/api";
import { SET_CURRENT_USER } from "../actionTypes";
//
// Lecture 379 @ 02:??
import { addError, removeError } from "./errors";
// Lecture 382 @ 05:59
// Yes, I know I import something else from api.js file at top of this file,
// keeping the import separate to add separate time stamps
import { setTokenHeader } from "../../services/api";
// added by ME, see below...
// import { Navigate } from "react-router-dom";


export function setCurrentUser(user) {
	return {
		type: SET_CURRENT_USER,
		user
		};
	}




// Lecture 381 @ 02:30
export function logout()
	{
	// Added by ME, see below...
	// const navigate = Navigate;
	// "use a thunk"..."?"
	return dispatch => {
		localStorage.clear();
		// Lecture 382 @ 05:55
		setAuthorizationToken(false);
		dispatch(setCurrentUser( {} ) );
		// Added by ME: logging out does not redirect to "/"
		// Possibly due to withAuth() not working due to changes in
		// react-router-dom v6
		// So, on NewMessageForm, "logout" leaves one at NewMessageForm
//		navigate("/", replace);
		};
	}


// Lecture 382 @ 05:55
export function setAuthorizationToken(token)
	{
	setTokenHeader(token);
	}



/**
 * A wrapper around axios API call that formats errors, etc.
 * @param {string} method the HTTP verb (method) to user (use lower case!)
 * @param {string} path the route path / endpoint
 * @param {object} data (optional) data in JSON format for POST requests
 */
// Lecture 377 @ 03:50
// This function is available in Main.js (passed on to AuthForm) via
// Main.js having mapDispatchToProps in its export default connect(...)
// Lecture 378 @ 02:30-ish
export function authUser(type, userData) {
	return dispatch => {
		return new Promise( (resolve, reject) => {
			// NOTE: axios in apiCall() requires lower-case methods.
			// Inside the apiCall function, we use method.toLowerCase()
			return apiCall("POST", `/api/auth/${type}`, userData)
				.then( ({token, ...user}) => {
					localStorage.setItem("jwtToken", token)
					// Lecture 382 @ 05:55:
					setAuthorizationToken(token);
					dispatch(setCurrentUser(user));
					// Lecture 379 @ 02:??
					dispatch(removeError);
					resolve();
					})	// end .then
				.catch(err =>
					{
					// Lecture 379 @ 02:??
					dispatch(addError(err.message));
//					reject();
/*
					console.log(`NOW we are catching errors, like "that username/email`
						` is taken: ${err.status}:${err.message}`);
*/
					});
			})	// end Promise
		}	// end dispatch
	} // end authUser
