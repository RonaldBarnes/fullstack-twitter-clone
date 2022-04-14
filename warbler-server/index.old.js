
// Load file called ".env":
require("dotenv").config();

const express = require( "express");
const app = express();
const cors = require("cors");
// express has own body parser (.json() and .urlencoded() methods) since v4.16
// Instead of require("body-parser"), one can use express.json(), etc.
const bodyParser = require("body-parser");

const PORT=3001;


app.use( cors() );
app.use(bodyParser.json());
// Elie does not use this, but it is required because... "?"
app.use(bodyParser.urlencoded({extended: true}) );


// "all my routes here -- they will come later"

app.use( function(req,res,next) {
	let err = new Error("Not Found");
	err.status = 404;
	next(err);
	});

app.listen(PORT, function() {
	console.log(`server is running on port ${PORT}`);
	});






const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/users");

const {
	loginRequired,
	ensureCorrectUser,
	isAdmin
	} = require("./middleware/auth.js");



/*
// var mysql = require("mysql");
const db = require("./models/index");

const User = require("./models/user");
*/



/*
app.use("/api/auth/:id",
	loginRequired,
	ensureCorrectUser,
	authRoutes
	);
*/
app.use("/api/auth", authRoutes);
app.use("/api/users/:id/messages",
	loginRequired,
	ensureCorrectUser,
	messageRoutes
	);

// app.use("/api/users/:id/delete",
app.all("/api/user/:id/delete",
	function( req, res, next) {
		console.log(`app.all: params=${JSON.stringify(req.params)}`);
		next();
		},
	loginRequired,
	ensureCorrectUser,
	userRoutes
	);
app.all("/api/user/:id/list",
	function( req, res, next) {
		console.log(`app.all: params=${JSON.stringify(req.params)}`);
		next();
		},
	loginRequired,
	ensureCorrectUser,
	userRoutes
	);
app.all("/api/user/all/list",
	loginRequired,
	ensureCorrectUser,
	isAdmin,
	userRoutes
	);
app.use("/test/:x", loginRequired,
	ensureCorrectUser,
	isAdmin,
	function( req, res, next) {
		res.send(`x=${req.params.x}`);
		},
	function( req, res, next) {
		res.send(`Say it again! x=${req.params.x}`);
		}
	);

/*
// I want a Get All Messages URL that invokes messagesGetAll
const { msgRoute2 } = require("./routes/messages");
app.use("/messages/:id", msgRoute2);
*/

/*
app.get("/api/messages",
	loginRequired,
	async function( req, res, next) {
		try {
			let messages = await db.Message.find()
				.sort( {createdAt: "desc"})
				.populate("user", {
					username: true,
					profileImageUrl: true
					})
			return res.status(200).json(messages);
			}
		catch(e) {
			e.location = "/index.js";
			return next(e);
			}
		}
	);
*/
/*
app.use("/api/users/:id/messages/:message_id",
	messageRoutes);

app.use("/api/messages/get", messageRoutes);
app.use("/api/messages/delete", messageRoutes);
*/


// ----------------------------------------------------------------------------
// No route matched: 404
// ----------------------------------------------------------------------------
app.use( function( req, res, next) {
	let error = new Error("Not Found");
	error.status = 404;
	// Go to next handler in "Middleware":
	console.log(`index.js 404: calling next(error)...`);
	error.location = "index.js app.use()";
	next(error);
	});
// ./handlers/error has module.exports errorHandler:
app.use( errorHandler);








// ----------------------------------------------------------------------------
// Start the server
// ----------------------------------------------------------------------------
app.listen( PORT, () => {
	console.log(`CORS-enabled nodejs server listening on port ${PORT}`);
	});





















// ----------------------------------------------------------------------------
// Routes...
// ----------------------------------------------------------------------------


let sql = '';


// ----------------------------------------------------------------------------
// Insert record (Crud)
// ----------------------------------------------------------------------------
app.post("/new/", async function( req, res, next) {

	var task = {task: req.body.task};

	sql = mysql.format("INSERT INTO nodejs SET ?", task);
	console.log(`sql: ${sql}`);


	pool.query( sql, async function(err, data, fields) {
		console.log(err, data, fields);
		if (err) {
			console.log(`ERROR INSERTING NEW RECORD! ${err}`);
			res.send(err);
			}
		else {
			// No error, send complete data record back to app / user:
			let recs = await getRecordById( data.insertId );
			// Only first record of array:
			// recs = recs[0];

			console.log(`INSERT recs: ${recs}, length = ${recs.length}`);

			res.send( recs[0] );
			} // end else
		}) // end 1st pool.query
	})






// ----------------------------------------------------------------------------
// Get ONE record by ID (cRud)
// ----------------------------------------------------------------------------
app.get("/:id", async function( req, res) {

	let recs = await getRecordById( req.params.id);
	// Only first record of array:
	// recs = recs[0];

	console.log(`recs[0]: ${recs[0]}, length = ${recs.length}`);

	res.send( recs[0] );
	}) // end app.get








// ----------------------------------------------------------------------------
// Get record by ID (cRud) HELPER
// ----------------------------------------------------------------------------
async function getRecordById( id ){		// req, res){
//	console.log(`getRecordById() id:${req.params.id}`);
	console.log(`getRecordById() id: ${id}`);

	sql = mysql.format("SELECT * FROM nodejs WHERE id=?", id);

	let retVal = new Promise( (resolve, reject) => {


	pool.query( sql, function( err, data, fields) {
		if (err) {
			console.log(`ERROR GETTING DATA! ${err}`);
			reject(err);
			}
		else {
			// This step (resolve(data) is REQUIRED else never completes!
			resolve(data);
			// get first row / record of results:
			// console.log(`data[0]= `, data[0] );
			}
		}) // end pool.query
	}) // end Promise
/*
	// retVal is UNRESOLVED at this point:
	console.log(`getRecordById() retVal: `, retVal); // Promise.resolve(retVal) );
	// STILL UNRESOLVED:
	console.log(`getRecordById() retVal: `, Promise.resolve(retVal) );
*/
	// seems to return a Promise...
	return retVal;
	}







// ----------------------------------------------------------------------------
// Get all records (cRud)
// ----------------------------------------------------------------------------
app.get("/", function( req, res, next){
	console.log(`GET ALL records`);

	sql = mysql.format("SELECT * FROM nodejs");

	pool.query( sql, function(err, data, fields){
		console.log(err, data, fields);
		if (err) {
			console.log(`ERROR GETTING DATA! ${err}`);
			throw error (err);
			}
		else {
			res.send( data );
			}
		}); // end conn.query
	}); // end app.get








// ----------------------------------------------------------------------------
// Update a record (crUd): accept field to update plus new value
// ----------------------------------------------------------------------------
app.put("/update/:id", function( req, res, next){
	console.log("UPDATE id:", req.params.id);
	console.log("UPDATE req.body:", req.body);


	let field = Object.keys(req.body)[0];
	let value = Object.values(req.body)[0];

	// const {field, value} = JSON.parse(req.body);
	// const {field, value} = Object.entries(req.body);


	// Boolean in mySQL are tinyint values of 0 or 1:
	if (value.toLowerCase() === 'true' || value === true) {
		value = 1;
		}
	else if (value.toLowerCase() === 'false' || value === false) {
		value = 0;
		}


	sql = mysql.format("UPDATE nodejs SET ??=? WHERE id=?",
		[field, value, req.params.id]);

	console.log(`sql: ${sql}`);

	pool.query(sql, async function(err, data, fields){
		if (err) {
			console.log(`UPDATE ERROR: ${err}`);
			throw new Error(err);
			res.send(false);
			}
		if (data.affectedRows > 0) {
			console.log(`UPDATE query result SUCCESS data: ${JSON.stringify(data)}`);
			let oneRec = await getRecordById( req.params.id) ;
console.log(`UPDATE: oneRec[0]=`, oneRec[0]);
			res.json( oneRec[0] );
//			res.json( await getRecordById( req.params.id) );
			// res.send(true);
			}
		else {
			console.log(`UPDATE query result FAILED data: ${JSON.stringify(data)}`);
			res.send(false);
			}
		});

	})





// ----------------------------------------------------------------------------
// Delete one record by ID (cruD)
// ----------------------------------------------------------------------------
app.delete("/delete/:id", function(req, res, next){
	console.log(`/delete/`);	// , req);

	sql = mysql.format("DELETE FROM nodejs WHERE id=?", req.params.id);

	pool.query(sql, function( err, data, fields){

		if (data.affectedRows) {
			console.log("DELETED ", data);
			res.json(true);
			}
		else {
//			throw new Error (err);
			console.log(`DELETE ERROR: `, err, data);
			res.json(false);
			}
		});
	})
