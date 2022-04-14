
// Lecture 386 @ 00:20

import React, { Component } from "react";
import { connect } from "react-redux";
// Lecture 386 @ 03:30
import { postNewMessage } from "../store/actions/messages";
import { useNavigate } from "react-router-dom";

// WTF, trying to redirect (navigate) to "/signin" upon logout
import { useEffect } from "react";


const fuckIt = (props) => {
		// Uncaught Error: Invalid hook call. Hooks can only be called
		// inside of the body of a function component.
		useEffect( () => {
		// Can't navigate back to "/" if not logged in - message showing:
		//
		// You should call navigate() in a React.useEffect(),
		// not when your component is first rendered.
			if (!props.isAuthenticated)
				{
				props.navigate("/");
				}
			});
		return( <NewmessageForm {...props} />);
	}



class NewMessageForm extends Component
	{
	constructor(props)
		{
		super(props);
		console.log(`NewMessageForm props:`, props);
		this.state =
			{
			message: ""
			}
		}


	handleNewMessage = event => {
		event.preventDefault();
		this.props.postNewMessage(this.state.message);
		this.setState( {message: ""} );
		// useNavigate NOT allowed inside Components, can't figure out how to
		// wrap class in function AND use connect(mapStateToProps,...)
		// FFS.
		this.props.navigate("/");
		};

	componentDidMount()
		{
		// let inputField = document.querySelector("inputNewMessage");
		let inputField = document.getElementById("inputNewMessage");
		// console.log(`NewMessageForm inputNewMessage: `, inputNewMessage);
		if (inputField !== null)
			{
			inputField.focus();
			}
		}

	render()
		{
		return (
			<form action="" onSubmit={this.handleNewMessage}>
				{ this.props.errors.message && (
					<div className="alert alert-danger">
						{this.props.errors.message}
					</div>
					) }
				<input type="text"
					className="form-control"
					id="inputNewMessage"
					value={this.state.message}
					onChange={e => this.setState( {message: e.target.value} )}
					/>
				<button type="submit"
					className="btn btn-success pull-right"
					>
					Add my message
				</button>
			</form>
			);	// end return
		}	// end render
	} // end NewMessageForm



function mapStateToProps(state)
	{
	console.log(`NewMessageForm mapStateToProps() state:`, state);
	return {
		errors: state.errors
		};
//	var x = wrapperFunction();
// console.log(`mapStateToProps() x=`, x);
	}



const MessageTemp = (props) => {
	const navigate = useNavigate();

		// Uncaught Error: Invalid hook call. Hooks can only be called
		// inside of the body of a function component.
		useEffect( () => {
		// Can't navigate back to "/" if not logged in - message showing:
		//
		// You should call navigate() in a React.useEffect(),
		// not when your component is first rendered.
			if (!props.isAuthenticated)
				{
				navigate("/");
				}
			});


//	const allProps = {navigate, ...props}
	return (
		<NewMessageForm navigate={navigate} {...props} />
//		<NewMessageForm navigate={allProps} />
//			<NewMessageForm />
		);
	}


// export { connect(mapStateToProps, {postNewMessage})(NewMessageForm) };
// Using intermediary MessageTemp function to enable useNavigate
// inside Class Component NewMessageForm, since hooks like useNavigate
// are forbidden from being declared in Class Components, etc.
export default connect(mapStateToProps, {postNewMessage})(MessageTemp);
