
// Lecture 374 @ 00:29
// Landing page showing messages list

// import React from "react";
import { Link } from "react-router-dom";
import MessageTimeline from "./MessageTimeline";


//	console.log(`components/Homepage.js props=`, props);
const Homepage = (props) => {
	const { currentUser } = props;
	//
	console.log(`Homepage.js currentUser:`, currentUser);
	// Lecture 380 @ ~01:00-02:00 for .isAuthenticated
	if ( currentUser === undefined || !currentUser.isAuthenticated )
	// Typo, had spelled it .isAuthenicated and caused me grief!
	// if ( currentUser.isAuthenticated === false )
		{
		return (
			<div className="home-hero">
				<h1>WTF is happening?</h1>
				<h2>Caching killed me</h2>
				<h4>New to Warbler?</h4>
				<Link to="/signup" className="btn btn-primary">
					Signup here.
				</Link>
			</div>
			); // end return
		} // end if !currentUser.isAuthenticated
	return (
		<div>
			<p>Welcome back {currentUser.user.username}!</p>
			<MessageTimeline
				profileImageUrl={currentUser.user.profileImageUrl}
				author={currentUser.user.username}
				/>
		</div>
		); // end return
	};	// end Homepage




const Homepage2 = (props) => {
console.log("\n\nHomepage3 props:", props);
return (
	<div className="home-hero">
		<h1>Homepage2</h1>
		<p>{props.test}</p>
		<Link to="/signup" className="btn btn-primary">
			Sign up to this failure Homepage2
		</Link>
	</div>
);
	};



const Homepage3 = (props) => {
console.log("\n\nHomepage3 props:", props);
return (
	<div className="home-hero">
		<h1>Homepage3</h1>
		<p>{props.test}</p>
		<Link to="/signup" className="btn btn-primary">
			Sign up to this failure Homepage3
		</Link>
	</div>
);
	};




const Homepage4 = (props) => {
	console.log("\n\nHomepage4 props:", props);
return (
	<div className="home-hero">
		<h1>Homepage4</h1>
		<p>{props.msg}</p>
		<Link to="/signup" className="btn btn-primary">
			Sign up to this failure Homepage4
		</Link>
	</div>
);
	};



export { Homepage, Homepage2, Homepage3, Homepage4 };
// export default Homepage;
