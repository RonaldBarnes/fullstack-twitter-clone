
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
import { connect } from "react-redux";
import {
	Navigate,
	useLocation,
	useNavigate
	} from "react-router-dom";


const AuthContext = React.createContext({
	authed: false,
	login: () => {},
	// Probably need to dispatch setCurrentUser(false):
	logout: () => {}
	});




export default function withAuth()
// export default function withAuth(ComponentToBeRendered)
//const withAuth = (ComponentToBeRendered) =>
	{
	// console.log(`withAuth() ComponentToBeRendered:`); //, ComponentToBeRendered);
	console.log(`withAuth()`);	// children:`, children);
//	const navigate = useNavigate();
/*
	return (
		<Authenticate
			ComponentToBeRendered={ComponentToBeRendered}
			navigate={navigate}
			{...props}
			/>
		);
	}
*/


	class Authenticate extends Component
		{
/*
		constructor(props)
			{
			super(props);
			console.log(`withAuth Authenticate constructor()`);
			}

		componentWillUpdate(nextProps)	 // Lecture 385 @ 03:50
		// componentDidUpdate()
			{
			if (!nextProps.isAuthenticated)
			// if (!this.props.isAuthenticated)
				{
				console.log("componentDidUpdate() redirecting to /signin");
				navigate("/signin");
				}
			}	// end componentDidMount
*/

/*
		componentWillMount()
//		componentDidMount()
			{
			console.log("componentWillMount()");
			if (!this.props.isAuthenticated)
				{
				console.log("componentWillMount() redirecting to /signin");
				navigate("/signin")
				}
			}	// end componentDidMount
		componentDidMount()
			{
			console.log("componentDidlMount()");
			if (!this.props.isAuthenticated)
				{
				console.log("componentDidMount() redirecting to /signin");
				navigate("/signin")
				}
			}	// end componentDidMount
*/

		render()
			{
			return <ComponentToBeRendered {...this.props} />;	// end return
			}	// end render
		}	// end Authenticate
function mapStateToProps(state)
	{
	return
		{
		isAuthenticated: state.currentUser.isAuthenticated
		}
	}	// end mapStateToProps
 return connect(mapStateToProps)(Authenticate);
	} // end withAuth

// Lecture 385 @ 05:00 -> Elie moves mapStateToProps() & return connect
// "INSIDE the definition of the class", although they're ouside the class
// but inside the function.
// "?!?"
/*
function mapStateToProps(state)
	{
	return
		{
		isAuthenticated: state.currentUser.isAuthenticated
		}
	}	// end mapStateToProps
*/

//return connect(mapStateToProps)(Authenticate);
//	}	// end withAuth



// export default connect(mapStateToProps)(Authenticate);
// export default connect(mapStateToProps)(withAuth);



/*
export default function(props)
	{
	const navigate = useNavigate();

	return connect(mapStateToProps, null)(<Authenticate navigate={useNavigate()} />)
	}
*/
