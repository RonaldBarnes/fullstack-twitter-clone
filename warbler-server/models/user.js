
// Models in the singular, handlers in the plural.
// Lecture 363 @ 00:10
// Where it makes sense, I guess. He has handlers/auth.js and handlers/error.js



// const mydb = require( "mysql" );
const mydb = require( "mongoose" );
const bcrypt = require( "bcryptjs" );
// location for error reporting / debuggin:
const location = "./models/user.js";


// ----------------------------------------------------------------------------
// const userSchema = new mysql.Schema({
const userSchema = new mydb.Schema({
	email: {
		type: String,
		required: true,
		unique: true
		},
	username: {
		type: String,
		required: true,
		unique: true
		},
	password: {
		type: String,
		required: true
		},
	profilePicUrl: {
		type: String
		},
	// NOTE: messages is an array to Message IDs:
	messages: [{
		type: mydb.Schema.Types.ObjectId,
		ref: "Message"
		}],
	isAdmin: {
		type: Boolean,
		default: false
		}
	},
	{
	// Add created & updated fields (handy!):
	timestamps: true
	}
	);





// ----------------------------------------------------------------------------
// Hook(s): pre-save:
// ----------------------------------------------------------------------------
userSchema.pre("save", async function( next ) {
	try {
		if (!this.isModified("password")) {
			// If password is unmodified, don't hash again, go to next middleware:
			return next();
			}
		// Is SALT actually a value of "10" or is 2nd param (in this case SALT)
		// meant to be ITERATIONS?
		let SALT = 10;
		let hashedPwd = await bcrypt.hash(this.password, SALT);
		this.password = hashedPwd;
		return next();
		}
	catch (err) {
		if (err.location === undefined)
			{
			err.location = `${location} userSchema.pre('save')`;
			}
		return next(err);
		}
	})


// ----------------------------------------------------------------------------
userSchema.methods.comparePassword = async function( testPwd, next) {
	console.log(`${location} comparePassword() testPwd="${testPwd}"`, next);


	try {
		if (testPwd === undefined) {
			let e = new Error("Password required");
			e.location = `${location} userSchema.methods.comparePassword()`;
			e.status = 401;
			throw e;
			}

		let isMatch = await bcrypt.compare( testPwd, this.password);
		return isMatch;
		}
	catch (err) {
		// err.location = location;
		err.location = `${location} userSchema.methods.comparePassword()`;
		return next(err);
		}
	}


// ----------------------------------------------------------------------------

// Other files in this folder contain:
// module.exports.User = require("./user");
// so they can refer to User model, i.e. in message.js, messages refer to User
const User = mydb.model("User", userSchema);
module.exports = User;
