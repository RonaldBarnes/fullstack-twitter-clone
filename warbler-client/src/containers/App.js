
// Lecture 370 @ 06:20
import React, { Component } from "react";
// Provider to wrap entire app in Redux store:
import { Provider } from "react-redux";
import { configureStore } from "../store"; // + "/index.js"
// Lecture 370 @ 04:00
// "Add router so we can navigate from page to page"
// (as seen in Memory Game / Flag Game project)
import { BrowserRouter as Router } from "react-router-dom";


// import './App.css';
import Navbar from "./Navbar";
import Main from "./Main";
import Homepage from "../components/Homepage";

// Lecture 382 @ 06:44 & 07:34
// Discusses "hydration": if server goes down or Redux store cleared...
import {
	setAuthorizationToken,
	setCurrentUser
	} from "../store/actions/auth";

// Lecture 382 @ 08:55
import jwtDecode from "jwt-decode";


const store = configureStore();


// Lecture 382 @ 06:55
if (localStorage.jwtToken)
	{
	setAuthorizationToken(localStorage.jwtToken);
	// Lecture 382 @ 08:00-ish
	// Prevent someone from manually tampering with the key
	// jwtToken in localStorage
	try {
		store.dispatch(setCurrentUser( jwtDecode(localStorage.jwtToken) ));
		}
	catch (e){
		// Force logout
		store.dispatch(setCurrentUser( {} ));
		}
	}




// stateless functional component:
const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<div className="onboarding">
					<Navbar />
					<Main propTest="test props" />
{/*
					// Without Homepage here, it doesn't render, despite being
					// inside a Route in ../containers/Main.js
					// Fucking deprecated Switch & withRouter are messing things up
					<Homepage />
*/}
				</div>
			</Router>
		</Provider>
		)
	}

export default App;
