

const db = require("../models/index.js");
// Above can be accomplished another way, since index.js is a DEFAULT:
// const db = require("./models/");

// const jwt = require("jsonwebtoken");


// For reporting error source / location
const location = `handlers/users.js` ;









// ----------------------------------------------------------------------------
exports.listUsersAll = async function( req, res, next) {
	console.log(`${location} listUsersAll() params: "${JSON.stringify(req.params)}"`);

	try {
		let userid = req.params.userid;
		let usersFromDb = await db.User.find();

		if (usersFromDb === null) {
			let e = new Error(`No users found(?!?)`);
			e.location = location;
			e.status = 400;
			throw e;
			}

		return res.status(200).json({
			usersFromDb
			});
		}
	catch(e) {
		return next(e);
		}
	}





// ----------------------------------------------------------------------------
exports.listUser = async function( req, res, next) {
	console.log(`${location} listUser() params: "${JSON.stringify(req.params)}"`);

	try {
		let userid = req.params.userid;
		let userFromDb = await db.User.findOne({
			_id: userid
		});

		if (userFromDb === null) {
			let e = new Error(`No such user "${userid}" found`);
			e.location = location;
			e.status = 400;
			throw e;
			}

		return res.status(200).json({
			userid: req.params.userid,
			username: userFromDb.username,
			email: userFromDb.email
			});
		}
	catch(e) {
		return next(e);
		}
	}


// ----------------------------------------------------------------------------
exports.deleteUser = async function( req, res, next) {
	console.log(`${location} deleteUser() params: "${JSON.stringify(req.params)}"`);
	let id = req.params.userid;

	try {
		let userFromDb = await db.User.findOne({
			_id: id
			});
		console.log(`userFromDb: findOne():`, userFromDb );

		if (userFromDb === null) {
			let e = new Error(`No such user "${id}" found`);
			e.location = location;
			e.status = 400;
			throw e;
			}
		// Why test for user's pwd instead of if isAdmin()?
		else if (req.body.password === undefined) {
			let e = new Error("Password required");
			e.location = location + " deleteUser()";
			e.status = 400;
			throw e;
			}

		let isMatch = await userFromDb.comparePassword( req.body.password, next);

		if (! isMatch) {
			const err_message = `BAD USER / PWD combo`;
			let error = new Error( err_message);
			error.status = 401;
			error.location = location + " before throw()";
			console.log(`${location} ${err_message} ${error.location}`);
			throw error;
			}

		userFromDb = await db.User.deleteOne({
			_id: req.params.userid
			});
		console.log(`after deleteOne(${req.params.userid}), userFromDb:`,
			userFromDb );

		// return next();
		return res.status(200).json({
			deleted: (userFromDb.deletedCount > 0 ? true : false),
			deletedCount: userFromDb.deletedCount || 0
			});
//      {username: req.body.username}
		}
	catch(e) {
		e.location = e.location || location + " deleteUser()";
		return next(e);
		}
	}
