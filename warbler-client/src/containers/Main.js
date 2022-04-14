
// Lecture 373 @ 00:25

import React from "react";

// NOTE: Switch is no longer in "react-router-dom"
// NOTE: withRouter is no longer in "react-router-dom"
import {
	Routes,			// instead of Switch,
	Route,
	// withRouter,
	// NO NEED TO import *Router: App.js includes this file inside a
	// BrowserRouter as Router!
	//
	// Unsure why Redirect is here, don't (seem to) use it:
	// Redirect,
	//
	//
	// WHAT THE ?: First warning (below) about a missing element, hence
	// blank page on matched route... (element is fine if attached to different
	// route).
	// THEN, I move that route lower, and Error: Outlet not defined:
	// Uncaught ReferenceError: Outlet is not defined
	// I have no idea how I fixed this...
	//
	//
	// testAuth is utterly broken / deprecated
	// Wild-assed attempt at moving to react-router-dom v6:
	// useNavigate,
	// useLocation,
	} from "react-router-dom";

import { connect } from "react-redux";
// import Homepage from "../components/Homepage";
import { Homepage } from "../components/Homepage";
import AuthForm from "../components/AuthForm";
//
import { authUser } from "../store/actions/auth";
//
// Lecture 379 @ 05:00
import { removeError } from "../store/actions/errors";
// Lecture 385 @ 04:30
// Having problem(s) with HOCs, "withAuth" specifically
// import { Authenticate } from "../components/AuthForm";
import withAuth from "../hocs/withAuth";
import NewMessageForm from "./NewMessageForm.js";


// Elie's method of "withAuth" to restrict NewMessageForm to logged in users
// does not work with react-router-dom v6
//
// Need to use Context, which passes props to children:
//
// https://reactjs.org/docs/context.html#when-to-use-context
const AuthContext = React.createContext(false);


const Main = (props) => {
	console.log(`Main.js props=`, props);
	const {
		authUser,
		errors,
		// Lecture 380 @ ~01:00
		// currentUser stored in Redux state (store?), via mapStateToProps
		currentUser
		} = props;





	//
	return (
		<div className="container">
<AuthContext.Provider value={currentUser.isAuthenticated || false}>
			<Routes>
				<Route exact path="/"
					element={
						<Homepage currentUser={currentUser} />
						}
					/>
				<Route exact path="/signin"
					element={
						<AuthForm
							onAuth={authUser}
							buttonText="Log in"
							heading="Welcome Back"
							// Lecture 379 @ 02:35
							errors={errors}
							removeError={removeError}
							{...props}
							/>
						}
					/>
				<Route exact path="/signup"
					element={
						<AuthForm
							onAuth={authUser}
							buttonText="Sign Me Up"
							heading="Welcome! Join Warbler Today"
							signUp
							// Lecture 379 @ 02:35
							errors={errors}
							removeError={removeError}
							{...props}
							/>
						}
					/>
				{ /* Lecture 385 @ 00:45 creates route & introduces HOCs */ }
{ console.log(`Main.js NEW MESSAGE ROUTE currentUser:`, currentUser) }
				<Route path="/users/:id/messages/new"
					element={
						<NewMessageForm isAuthenticated={currentUser.isAuthenticated} />
						/* SEE TestAuth.js for example on working authentication */
						/* withAuth(NewMessageForm) */
						}
					/>
				<Route path="*" element={<Homepage msg="ASTERISK" />} />
			</Routes>
</AuthContext.Provider>
		</div>
		);	// end return
	}	// end Main


function mapStateToProps(state)
	{
console.log(`mapStateToProps():`, state);
	return {
		currentUser: state.currentUser,
		// Lecture 379 @ 02:35
		errors: state.errors
		};
	}

// export default withRouter(connect(mapStateToProps, null))(Main);
export default connect(
	mapStateToProps,
	// mapDispatchToProps:
	{ authUser, removeError })
	(Main)
	;
