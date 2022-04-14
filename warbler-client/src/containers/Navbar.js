
// Lecture 371 @ 01:50
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Logo from "../images/warbler-logo.png";
// Lecture 381 @ 03:13
import { logout } from "../store/actions/auth";


class Navbar extends Component {
	constructor(props) {
		super(props);
		console.log(`Navbar props:`, props);
		}

	// Lecture 381 @ 03:23
	logout = e => {
		e.preventDefault();
		console.log(`Navbar logout function, calling this.props.logout next:`);
		this.props.logout();
		}


	componentDidMount()
		{
		document.title = "Warbler";
		// console.log(`componentDidMount() title has been set.`);
		}



	render()
		{
//		const { currentUser } = props || { isAuthenticated: false };
		//
		// Avoid displaying links for Signup & Signin if already authenticated:
		console.log(`Navbar auth'd: ${this.props.currentUser.isAuthenticated}`);

		return (
			// Bootstrap stuff:
			<nav className="navbar navbar-expand">
				<div className="container-fluid">
					<div className="navbar-header">
						<Link to="/" className="navbar-brand">
							<img src={Logo} alt="Warbler Home" />
						</Link>
					</div>
					{ /* Lecture 381 @ 04:50 */ }
					{ /* {If (isAuthenticated ? ... : ... )}	*/ }
					{this.props.currentUser.isAuthenticated ?
						(
						<ul className="nav navbar-nav navbar-right">
							<li>
								<Link
									to={`/users/${this.props.currentUser.user.id}/messages/new`}>
									New Message
								</Link>
							</li>
							<li>
								<a onClick={this.logout}>
									Log Out
								</a>
							</li>
						</ul>
						)
						:
						(
						<ul className="nav navbar-nav navbar-right">
							<li>
								<Link to="/signup">Sign up</Link>
							</li>
							<li>
								<Link to="/signin">Log in</Link>
							</li>
						</ul>
						)
					}	{ /* end isAuthenticated tertiary  _ ? _ : _ */ }
				</div>
			</nav>
			)	// end return
		}	// end render
	}	// end Navbar



function mapStateToProps(state)
	{
	return {
		currentUser: state.currentUser
		};
	}


export default connect(mapStateToProps, { logout })(Navbar);

// export default Navbar;
