
/* Lecture 385 @ 00:45 creates route & 01:05 introduces HOCs */
//
// This is called from containers/Main.js for MessageCreate route
// to ensure a user is logged in before gaining access to a component
//
// HOCs are usually called withSomething...
//
//
// This lesson is a complete clusterfuck
//
// history object is deprecated
// componentWillMount is deprecated
// componentWillUpdate is deprecated
//
// Once again, we're completely on our own in how to implement the course
// solution, as the lecture will not work with modern react-router-dom



import React, { Component } from "react";
import connect from "react-redux";
import { useNavigate } from "react-router-dom";



export default function withAuth(ComponentToBeRendered)
	{
//	const navigate = useNavigate();

	class Authenticate extends Component
		{
		// componentWillUpdate(nextProps)	Lecture 385 @ 03:50
		componentDidUpdate()
			{
			// if (!this.nextProps.isAuthenticated)
			if (!this.props.isAuthenticated)
				{
				console.log("componentDidUpdate() redirecting to /signin");
				// navigate("/signin");
				}
			}	// end componentDidMount
		componentDidMount()
			{
			if (!this.props.isAuthenticated)
				{
				console.log("componentDidMount() redirecting to /signin");
				// navigate("/signin")
				}
			}	// end componentDidMount
		}	// end Authenticate
	render()
		{
		return <ComponentToBeRendered {...this.props} />;	// end return
		}	// end render
	}	// end withAuth




function mapStateToProps(state)
	{
	return
		{
		isAuthenticated: state.currentUser.isAuthenticated
		}
	}

return connect(mapStateToProps, null)(Authenticate);
/*
export default function(props)
	{
	const navigate = useNavigate();

	return connect(mapStateToProps, null)(<Authenticate navigate={useNavigate()} />)
	}
*/
