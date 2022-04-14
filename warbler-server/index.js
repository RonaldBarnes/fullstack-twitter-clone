
// Load file called ".env":
require("dotenv").config();

const express = require( "express");
const app = express();
const cors = require("cors");
// express has own body parser (.json() and .urlencoded() methods) since v4.16
// Instead of require("body-parser"), one can use express.json(), etc.
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/users");
const {
	loginRequired,
	ensureCorrectUser,
	isAdmin
	} = require("./middleware/auth");

// Bring in ./models/index.js where "db" is defined so we can use it below,
// in our get All Messages code
const db = require("./models");

const PORT=3001;


app.use( cors() );
app.use(bodyParser.json());
// Elie does not use this, but it is required because... "?"
app.use(bodyParser.urlencoded({extended: true}) );


// Here is a field added to errors (err.location) for handy debugging,
// since ./handlers/error.js always outputs it:
let location = "index.js";


// "all my routes here -- they will come later"

// This will capture requests to /api/auth/{whatever is in authRoutes}
// authRoutes contains, i.e. /signup and /signin (and, maybe, isAdmin):
// And, it expects POST requests per Elie, but I may change to route.all:
// SO, POST to /api/auth/signup gets handled by the next line:
app.use("/api/auth", authRoutes);

// Activate messages routes:
// app.use("/api/users/:id/messages", messageRoutes);
// Activate MIDDLEWARE for messages routes:
app.use("/api/users/:id/messages",
	// middleware function(s):
	loginRequired,
	ensureCorrectUser,
	// routes:
	messageRoutes
	);



// Lecture 366 @ 03:48:
//
// All messages for all users, must be logged in to view though:
app.get("/api/messages",
	loginRequired,
	async function(req,res,next) {
		try {
			let messages = await db.Message.find()
				.sort( { createdAt: "desc" })
				// Discussion on populate at lecture 366 @ 04:51
				// Fetch all most-recent messages with their user / creator & avatars:
				// Basically, .populate() runs a second query, similar to a join
				.populate( "user", {
					username: true,
					profileImageUrl: true
					})
				;
			console.log(`${location}\n messages: ${messages}`);
			return res.status(200).json(messages);
			}
		catch(err) {
			err.location = location;
			next(err);
			}
		}); // end app.use("/api/messages")




// Delete user:
app.delete("/api/user/:userid",
	isAdmin,
	userRoutes
	);

/*
// The following code is deprecated, the ABOVE, short code, replaces it.
app.delete("/api/user/:id/delete", async function( req,res,next) {
//app.use("/api/user/:id", async function( req,res,next) {
	try
		{
		console.log("APP.DELETE");
		deleteUser();
		return res.status(200).send("HEARD YOUR MESSAGE TO DELETE USER");
		}
	catch(err)
		{
		err.location = `${location} app.delete`;
		next(err)
		}
	});
*/


// app.use ensures all methods caught, app.get only does GET method:
app.use( function(req,res,next) {
	let err = new Error("Not Found");
	err.status = err.code = 404;
	err.location = "index.js";
	err.message = `IP Address ${req.ip} requested URL "${req.originalUrl}"`
		+ ` method: ${req.method}`
	next(err);
	});


// This captures all 404 errors, handling the 404 stanza above
// However, this must come AFTER
// NOTE: this doesn't *OVER-RIDE* above 404 stanza, it provides the
// error handler that processes (provides middleware for) that 404!
//
// ./handlers/error.js has module.exports errorHandler:
app.use( errorHandler);



app.listen(PORT, function() {
	console.log(`server is running on port ${PORT}`);
	});





// Cut a bunch of code - backup copy in index.old.js
