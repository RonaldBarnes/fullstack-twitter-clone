
// Models in the singular, handlers in the plural.
// Lecture 363 @ 00:10
// Where it makes sense, I guess. He has handlers/auth.js and handlers/error.js


const db = require("../models/index.js");
// Above can be accomplished another way, since index.js is a DEFAULT:
// const db = require("./models/");

const jwt = require("jsonwebtoken");

// For reporting error source / location
const location = `handlers/auth.js` ;

/*
exports.signin = function() {
	console.log("handlers/auth/signin");
	return "handlers/auth/signin";
	};
*/


// ----------------------------------------------------------------------------
exports.signup = async function(req, res, next) {
	try {
		// Create user
		// console.log(`${location} signup()...`);
		console.log(`${location} signup() req.body:`, req.body);

		if ( req.body.username === undefined
				|| req.body.password === undefined
				|| req.body.email === undefined ) {
			e = new Error("username, password, and email MUST be defined");
			e.location = location + " signup()";
			e.status = 400;	// 400 = Bad Request
			throw e;
			};

		let user = await db.User.create(req.body);
		let {id, username, profilePicUrl} = user;
		// Create token  (header / sig / payload)
		let token = jwt.sign(
			{
				id: id,
				username: username,
				profilePicUrl: profilePicUrl,
			},
			process.env.SECRET_KEY
			);

		return res.status(200).json({
			id,
			username,
			profilePicUrl,
			token
			});
		}
	catch (err) {
		// Handle special if username / email is already taken
		// If validation fails returns 11000 in MONGOOSE
		if (err.code === 11000) {
			err.message = "Sorry, that username and/or email is taken.";
			err.status = 403; // Forbidden
			err.location = `${location} signup() catch()`;
			}
		// Else, return generic 400 error
		console.log(`${location} caught error:`,
			err.code, err.status, err.message);
		return next(err);

/*
		return next({
			status: err.status || 400,
			// This shows in the console, not user agent?!?
			// Try wget ... 2>&1 | less and see it, duh!
			// And now, with 403 (Forbidden), doesn't show json again. WTF?
			// DOES work if status set to 300 (as a test)...
			//
			// SOME CODES SIMPLY SHOW THE STATUS MESSAGE, SOME ALLOW more
			message: err.message + " handlers/auth.js"
			});
*/
		} // end catch
	};










// ----------------------------------------------------------------------------
exports.signin = async function(req, res, next) {

	console.log(`${location} signin()...`);
	console.log(`${location} req.body:`, req.body);
	console.log(`${location} req.params:`, req.params);
	console.log(`${location} req.query:`, req.query);
//	console.log(`${location} req:`, req);


	// Support GET (req.query) as well as POST (req.body):

/*
	// Why doesthis fail?!?:
	//
	/home/uid1/Projects/udemy/nodejs/warbler/warbler-ron/handlers/auth.js:107
	     req.body.username || req.query.username,
	        ^
SyntaxError: Unexpected token '.'
	//
	// failing code:
	let {username, email, passwd} = {
		req.body.username || req.query.username,
		req.body.email || req.query.email,
		req.body.password || req.query.password
		};
	//
	// working code:
	YET, this works:
*/
	let usernameReq = req.body.username || req.query.username;
	let emailReq = req.body.email || req.query.email;
	let passwordReq = req.body.password || req.query.password;
console.log(`${location}: username: ${usernameReq} email: ${emailReq}`);


	try {
		const userFromDb = await db.User.findOne(
//			{username: req.body.username}
//			{email: req.body.email}
			{email: emailReq}
			);
//.exec();

		if (!userFromDb) {
			const err_message = `User: "${usernameReq}" with email: "${emailReq}" `
				+ `NOT FOUND`;
			console.log(`${location} ${err_message}`);
			let err = new Error( `${err_message}`);
			err.location = location;
			err.status = 400;
//			throw err;
			return next(err);
			}
		else {
			console.log( `${location} userFromDb: ${userFromDb}`);
			// console.log(`${location} found user "${userFromDb.username}" in DB`);
			}

		let {id, username, password, profilePicUrl} = userFromDb;

		// When run with undefined password, error occurs:
		// "handlers/auth.js catch() ERROR: next is not a function"
		// let isMatch = await userFromDb.comparePassword( req.body.password, next);
		let isMatch = await userFromDb.comparePassword( passwordReq, next);


		if (! isMatch) {
			const err_message = `BAD USER / PWD combo`;
			let error = new Error( err_message);
			error.location = location + " before throw()";
			console.log(`${location} ${err_message} ${error.location}`);
			throw error;
/*
			return next({
				status: 400,
				message: err_message,
				location: location + " !isMatch"
				});
*/
			}


		// Create token  (header / sig / payload)
		console.log(`${location} jwt.sign() next:`);
		// NOTE: the final segment of token contains "iat" field (1648710932):
		// some time stamp - seconds since epoch?
		let token = jwt.sign(
			{
			id: id,
			username: username,
			profilePicUrl: profilePicUrl,
			}
			, process.env.SECRET_KEY
/*
			, function(err) {
				console.log(`${location} jwt.sign() CALLBACK: error?`);
				}
*/
			);

		return res.status(200).json({
			id,
			username,
			profilePicUrl,
			token
			});
		}
	catch (err) {
		console.log(`${location} catch() ERROR: ${err.message}`);

		return next({
			message: err.message,
			status: err.status || 400,
			location: err.location || location + " catch()",
			});
		}
	};
