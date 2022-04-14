
// Models in the singular, handlers in the plural.
// Lecture 363 @ 00:10
// Where it makes sense, I guess. He has handlers/auth.js and handlers/error.js
//
//
// NOTE: models are singular (i.e. message.js) and
// handlers are plural (i.e. messages.js)


const db = require("../models/index.js");
// remember - the above can be shortened to:
// const db = require("../models");


let location = "handlers/messages.js";



// ----------------------------------------------------------------------------
// Elie says URL for this function might be something like:
// /api/users/:id/messages
// See lecture 363 @ 02:14
exports.createMessage = async function( req, res, next) {
	try {
		let message = await db.Message.create({
			text: req.body.text,
			user: req.params.id
			});
		let foundUser = await db.User.findById( req.params.id);
		foundUser.messages.push(message.id);
		await foundUser.save();

		// The underscore on the "id" field is optional, lecture 363 @ 03:21
		// Also, that's where "populate" is discussed...
		let foundMessage = await db.Message.findById(message._id).populate("user",
			{
			username: true,
			profileImageUrl: true
			}); // end populate

		return res.status(200).json( foundMessage );
		}
	catch (error) {
		error.location = "handlers/messages.js createMessage()";

		return next(error);
		}
	};







// ----------------------------------------------------------------------------
exports.getMessage = async function( req, res, next) {
	// This gets run multiple times per call, appending itself repeatedly:
	// location += ` getMessage()`;
	// Would this be fixed if: function getMessage()... exports getMessage ?

	// console.log(location);
	console.log(`${location} getMessage()`, req.params);
	try {
		// "Where does the message_id come from"?
		// Lecture 366 @ 00:33
		// To get here, URL is GET /api/users/:id/messages/:message_id
		// let message = await db.Message.find( {id: req.params.message_id} );
		// NOTE: Elie simply puts an ID here, no _id: field identifier:
		// NOTE: This gives an error though:
		// "parameter "filter" to find() must be an object, got ${message_id}
		// let message = await db.Message.find( req.params.message_id );
		let message = await db.Message.find( { _id: req.params.message_id });
		//
		// NOTE: if NO message found, no error, just empty ${message}
		// Should instead return 404?
		console.log(`${location} getMessage() message found:\n ${message}`);
		return res.status(200).json( message );
		}
	catch(err) {
		err.location = `${location} getMessage()`;
		return next(err);
		}
	};






// ----------------------------------------------------------------------------
// This entire function is (re-)defined inside /index.js!
// Interesting...
/*
exports.getMessagesAll = async function( req, res, next) {
	location += " getMessagesAll()";
	console.log(location, res.params.id);
	try {
		let messages = await db.Message.find( { id:);
		return res.status(200).json( messages );
		}
	catch(e) {
		e.location = location;
		return next(e);
		}
	};
*/





// ----------------------------------------------------------------------------
exports.deleteMessage = async function( req, res, next) {
	// Next line causes location to (eventually) become:
	// location: "handlers/messages.js deleteMessage() deleteMessage() deleteMessage() deleteMessage() deleteMessage()"
	// location += ` deleteMessage()`;

	console.log(location);
	try {
		// "Where does the message_id come from"?
		// Lecture 366 @ 00:33
		// To get here, URL is DELETE /api/users/:id/messages/:message_id
		//
		// Also, we use .findById() then .remove to invoke our schema's
		// .pre("remove",...) hook!
		// .findByIdAndRemove() will NOT invoke hook
		let foundMessage = await db.Message.findById(req.params.message_id);
		console.log(`${location} deleteMessage() foundMessage:`, foundMessage);
		if (foundMessage === null)
			{
			let error = new Error("Message Not Found");
			error.location = `${location} deleteMessage()`;
			error.code = error.status = 400;
			throw error;
			}
		// Calling remove invokes our remove hook in models/message.js:
		await foundMessage.remove();
		return res.status(200).json(foundMessage);
		}
	catch(err) {
		err.location = err.location || `${location} deleteMessage`;
		// err.message += "\n Maybe trying to delete non-existant message?";
		return next(err);
		}
	};

