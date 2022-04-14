

//			{ document.getElementById("email").focus() }

// Lecture 375 @ 00:30
//
//
import { Link, useNavigate } from "react-router-dom";
import React, { Component } from "react";




class AuthForm extends Component {
	constructor(props) {
		console.log(`AuthForm constructor()`);
		super(props);
		//
		this.state = {
			email: "",
			username: "",
			password: "",
			profileImageUrl: ""
			};
		// Do not need these here:
		const {
			navigate,
			onAuth
			} = this.props;
		}


	componentDidMount()
		{
		//
		// Focus on email field (if exists), since login / signup screen:
		let emailField = document.getElementById("email");
		// console.log(`AuthForm emailField:`, emailField);
		if ( emailField !== null)
			{
			emailField.focus();
			}
		}


	// Arrow function to preserve value of "this":
	handleChange = (event) => {
		// console.log("handleChange() event:", event);
		this.setState({
			[event.target.name]: event.target.value
			});
		}	// end handleChange


	handleSubmit = (event) => {
		event.preventDefault();
		//
		// console.log("AuthForm handleSubmit() event:", event);
		// console.log("AuthForm handleSubmit() onAuth:", this.props.onAuth);
		//
		const authType = this.props.signUp ? "signup" : "signin";
		const {
			navigate,
			onAuth
			} = this.props;

		onAuth(authType, this.state)
			.then( () => {
				console.log(`AuthForm handleSubmit() LOGGED IN!`);
				navigate("/");
				})
			// Lecture 380 @ 02:20
			.catch( (err) => {
				console.log(`AuthForm this.props.onAuth() failed  .catch()`, err);
				return;
				});
		}	// end handleSubmit


	render() {
		console.log(`AuthForm constructor()`);
		//
		const {
			email,
			username,
			password,
			profileImageUrl
			} = this.state;
		const {
			heading,
			buttonText,
			signUp,
			errors,
			// Lecture 379 @ 05:45
			// history,
			removeError,
			} = this.props;


			// Lecture 379 @ 05:50
			// BUT - GIVES ERROR WTF?
			// trying this from stackoverflow:
			// const history = useNavigate();
			// That line above gives an interesting error:
			//  Invalid hook call. Hooks can only be called inside of the body of a function
			// See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
/*
			history.listen( () => {
				removeError();
				});
*/
		// Instead, try this dirty, filthy hack:
		// Check for exact error message of failed signup, and if we've
		// arrived here to signIN (signUp is undef), remove the error.
		// Haven't found an elegant way to replace deprecated history object, FFS:
		//
		// PROBLEM:
		// Warning: Cannot update a component (`Connect(Main)`) while
		//	rendering a different component (`AuthForm`).
		// The removeError() below operates as dispatch, and changes state
		// (I think that is the problem)
		//
		// WAIT -- now it's working and I haven't made any changes?!?
		// It only happened once (and error was copy/pasted from console)
		// It happens ONLY ONCE, as a Warning, and doesn't show again.
		// The following code throws the warning yet it removes the error
		// message from the signIN screen, so... I'm keeping it.
		//
		// useNavigate has addListener ... try that ... eventually?
		// https://reactnavigation.org/docs/navigation-events
		//
		if (errors.message === "Sorry, that username and/or email is taken."
			&& signUp == undefined)
			{
			removeError();
			}


		return (
			<div className="row justify-content-md-center text-center">
				<div className="col-md-6">
					<form onSubmit={this.handleSubmit}>
						<h2>{heading}</h2>
						{ /* DO not like this coding style Lecture 379 @ 03:49 */ }
						{errors.message && (
							<div className="alert alert-danger">
								{errors.message}
							</div>
							)}
						<label htmlFor="email">Email:</label>
						<input
							type="email"
							id="email"
							name="email"
							onChange={this.handleChange}
							value={email}
							className="form-control"
							required
							/>
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							name="password"
							/* Elie removed this @ Lecture 375 @ 07:43 */
							/*	"But, we still want an onChange... */
							/* value={password} */
							onChange={this.handleChange}
							className="form-control"
							required
							/>
						{ /* This seems a dumb way to test if props.signUp === true */ }
						{signUp && (
							<div>
								<label htmlFor="username">Username:</label>
								<input
									type="text"
									name="username"
									id="username"
									value={username}
									className="form-control"
									onChange={this.handleChange}
									/>
								<label htmlFor="profileImageUrl">Profile Image URL:</label>
								<input
									type="text"
									name="profileImageUrl"
									id="profileImageUrl"
									className="form-control"
									onChange={this.handleChange}
									/>
							</div>
							)}	{ /* end signUP */ }
						<button
							type="submit"
							className="btn btn-primary btn-block btn-lg">
							{buttonText}
						</button>
					</form>
				</div>
			</div>
			);	// end return
		};	// end render
	}	// end class AuthForm




	// THIS causes hook-call-warning:
	// const navigate = useNavigate();
	//
	// https://reactjs.org/warnings/invalid-hook-call-warning.html
	// Do not call Hooks in class components.
	// Do not call in event handlers.
	//
	// Trick: wrap the class component inside an exported functional component:
	// https://reactnavigation.org/docs/use-navigation/
	//
// export default AuthForm;

export default function (props)
	{
	const navigate = useNavigate();

	return <AuthForm {...props} navigate={navigate} />;
	}
