
// Models in the singular, handlers in the plural.
// Lecture 363 @ 00:10
// Where it makes sense, I guess. He has handlers/auth.js and handlers/error.js



// Connect to Database...
// SO, mongoose has lots of extra features, cannot replicate (easily)
// with mySQL:
// const mysql = require( "mysql" );


const db = require("mongoose");
// Would be nice if this could be an option in the connect 2nd param Object
db.set("debug", true);

// I've been hating on Promises lately.
db.Promise = Promise;


db.connect(	'mongodb://localhost/warbler', {
	useNewUrlParser: true,
	keepAlive: true,
	// Warning / Error: unneeded since v5
	// useMongoClient: true
	});


// Um, what?!?
// Guessing that this file is required() via ../index.js and saves having to
// include them individually there?
//
// It's called "bundling" - see lecture 359 @ 13:30
// Also, lecture 362 @ 03:36
module.exports.User = require("./user");
module.exports.Message = require("./message");





/*
// ----------------------------------------------------------------------------
// mySQL testing below: unused in Warbler app
// ----------------------------------------------------------------------------
// var conn = mysql.createConnection(
var pool = mysql.createPool(
	{
	host: "localhost",
	user: "nodejs",
	password: "9690950bf78d69049eb916154c609783fd2ed40d",
	database: "nodejs",
	keepAlive: true,
	// debug: true,
	});





// ----------------------------------------------------------------------------
pool.getConnection( function(err, conn) {
	if (err) {
		console.log(`ERROR connecting to database:`, err);
		throw new Error( err );
		}
	const {host, database} = pool.config.connectionConfig;
	console.log(`Connected to database ${database}@${host}`)

	// testConnection(conn);
	});









// ----------------------------------------------------------------------------
// Simply test the connection (mySQL)
// ----------------------------------------------------------------------------
function testConnection(conn) {
	console.log(`testConnection(): `); // , conn);

	try {
		console.log("conn.connect() NEXT:");
		conn.connect();
		}
	catch(err) {
		console.log(`testConnection() ERROR: ${err}`);
		conn.end();
		}

	conn.query("SELECT 1+2 AS answer", function( err, rows, fields, err) {
		if (err) {
			console.log("Error in testConnection(): ", err);
			next(err)
			//  throw err;
			}

		console.log("The test mySQL query worked: ", rows[0].answer);
		});

//	conn.end();
//	conn.destroy();
	}
*/
