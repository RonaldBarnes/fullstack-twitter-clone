
// Models in the singular, handlers in the plural.
// Lecture 363 @ 00:10
// Where it makes sense, I guess. He has handlers/auth.js and handlers/error.js


const db = require("mongoose");
// Why are we bringing in our user model?
// Lecture 362 @00:30 explains: each message has reference to owner user
const User = require("./user");

const messageSchema = new db.Schema({
	text: {
		type: String,
		required: true,
		maxLength: 160
		},
	user: {
		type: db.Schema.Types.ObjectId,
		// User from /models/user.js - name of user model
		ref: "User"
		},
	},
	{
	// Add created & updated fields (handy!):
	// inserts fields createdAt and updatedAt:
	timestamps: true
	}
);


messageSchema.pre("remove", async function(next) {
	try {
		// See lecture 362 @ 05:50
		// Elie originally had this.userId but fixed it in 366 @ 02:14:
		// this == message model, user is a "ref" field in schema & lower-case:
		let user = await User.findById(this.user);

		// See lecture 362 @ 05:50
		// Also, user.messages, not user.message:
		user.messages.remove(this.id);
		await user.save()

		return next();
		}
	// See lecture 362 @ 05:50
	// Elie typed "catch(e) but message on screen says catch(err)
	// Mine's okay, consistent use of "e", not "e" then "err"
	catch (e) {
		e.location = "models/message.js catch()";
		return next(e);
		}
	});


const Message = db.model("Message", messageSchema);
module.exports = Message;

