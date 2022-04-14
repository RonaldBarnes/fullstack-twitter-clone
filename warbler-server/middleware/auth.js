
// I think the .config() should only be used at top of main index.js:
// require("dotenv").config();
// Elie uses this:
// require("dotenv").load();
//
// ALSO, he comments on whether or not it's necessary here, "may be able to
// get away with the require("dotenv").config() in /index.js, but let's be
// safe" (paraphrasing)...
//
// Lecture 364 @ 00:45
//
// WAIT A SECOND... .load() throws error:
// TypeError: require(...).load is not a function



// Also note HTTP codes, 401 vs 403:
// https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
//
// Basically, 401 for Unauthorized, 403 for Forbidden


const jwt = require("jsonwebtoken");
const db = require("../models/index.js");


let location = "middleware/auth.js";




//------------------------------------------------------------------------------
// Make sure user is logged in - Authentication
exports.loginRequired = function( req, res, next) {
	try {
		const token = req.headers.authorization.split(" ")[1]; // realm: Bearer __
		/*
		console.log(`${location} loginRequired() token: ${token}`,
			`authorization header: ${req.headers.authorization}`);
		*/
		jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
			if (decoded) {
				console.log(`${location} loginRequired() decoded jwt success`);
				return next();
				}
			else {
				return next({
					status: 401,	// Unauthorized
					message: "Please log in first",
					location: location
					})
				} // end else
			}) // end jwt.verify
		}
	catch (e) {
		// NOTE: if authorization failes due to bad / missing header,
		// this error message may not be most-appropriate
		return next({
			status: 401,	// Unauthorized
			message: "Please log in first",
			location: location
			});
		}
	}





//------------------------------------------------------------------------------
// Make sure user is correct user - Authorization
// URL to reach here is /api/users/:id/messages
exports.ensureCorrectUser = function( req, res, next) {
	// console.log(`${location} ensureCorrectUser req.params=`, req.params);

	try {
		const token = req.headers.authorization.split(" ")[1];
		jwt.verify( token, process.env.SECRET_KEY, function( err, decoded) {
			console.log(`${location} ensureCorrectUser`
				+ ` decode SUCCESS`
				// + ${JSON.stringify(decoded)}`
				// + ` and req.params=${JSON.stringify(req.params)}`
				);

			// Compare header tokenized ID to URL's ID:
			if (decoded && decoded.id === req.params.id) {
				console.log(`${location} decoded.id: ${decoded.id} passes`
					+ ` ensureCorrectUser`);
				return next();
				}
			else {
				console.log(`${location} ensureCorrectUser() FAIL:\n`,
					`decoded.id    ${decoded.id} not equal to \n`,
					`req.params.id ${req.params.id}`);
				return next({
					message: "Forbidden",		// Unauthorized",
					status: 403,						// 401,
					location: location
					});
				} // end else
			}); // end jwt.verify
		}
	catch (e) {
		return next({
			message: `Forbidden: ${e}`,		// `Unauthorized: ${e}`,
			status: e.status || 403,
			location: e.location || location
			});
		}
	}




//------------------------------------------------------------------------------
// Is user an admin?
exports.isAdmin = async function( req, res, next) {
	console.log(`${location} isAdmin() params:`, req.params);
	console.log(`${location} isAdmin() body:`, req.body);
	const {
		loginRequired,
		ensureCorrectUser
		} = require("./auth");

	try {
		// Seems best way to have loginRequired run is NOT to call from here,
		// but to add to middleware in index.js @app.use(...,...,...)
		// Can't seem to reference the login function from here, even with
		// prefixing with "this.":
/*
		if (loginRequired(req, res, next) ) {
				&& ensureCorrectUser(req, res, next) ) {
			console.log(`${location} isAdmin = maybe`);
			}
		else {
			console.log(`${location} isAdmin = failed`
				+ ` loginRequired and/or ensureCorrectUser...`);
			}
*/

		if (req.headers.authorization == undefined)
			{
			err = new Error("Missing Authorization Header");
			err.status = err.code = 401;
			err.location = `${location} isAdmin()`;
			throw err;
			}

		const token = req.headers.authorization.split(" ")[1];
		const {username, id} = jwt.verify(
			token,
			process.env.SECRET_KEY,
			function( err, decoded) {
				console.log(`${location} isAdmin`
					+ ` decoded: ${JSON.stringify(decoded)}`
					);
				return decoded;
				});
		console.log(`${location} isAdmin username: ${username}`);
		// NEXT: test if tokenized username matches user-provided pwd in req
		// THEN, if those match, next()
		//
		let userFromDb = await db.User.findOne(
			{username: username}, {isAdmin: true} );
		console.log(`${location} isAdmin(): ${username} isAdmin? `, userFromDb);
		if (userFromDb.isAdmin !== true)
			{
			console.log(`isAdmin is FALSE: no access allowed`);
			let err = new Error("User Not Administrator");
			err.location = `${location} deleteUser()`;
			err.status = err.code = 403;
			throw(err);
			}
		return next();
		}
	catch(e) {
		e.location = e.location || location + " isAdmin()";
		e.status = e.status || 400;
		return next(e);
		}
	}
