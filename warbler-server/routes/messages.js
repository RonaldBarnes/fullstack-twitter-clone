
const express = require("express");
// "mergeParams lets us access the id inside this router"
// /api/users/:id/messages  <-- gets us the user's ID from :id param
//
// per Elie, lecture 363 @ 04:55
const router = express.Router( {mergeParams: true});

const {
	createMessage,
	getMessage,
	deleteMessage,
//	getMessagesAll,
  } = require("../handlers/messages");

// prefix will be /api/users/:id/messages
// WHY?!?  See index.js at app.use("/api/users/:id/messages",...);
//
// See lecture 363 @ 05:20
//
// Because, the prefix that brings us to this point will be:
// URL pattern: /api/users/:id/messages
// And we don't need anything beyond the "messages"...
router.route("/").post(createMessage);

// See lecture 366 @ 02:51 for these routes:
// /api/users/:id/messages/:message_id
router
	.route("/:message_id")
		.get(getMessage)
		.delete(deleteMessage)
	;

/*
// URL pattern: /api/users/:id/messages/:message_id
router
	.route("/:message_id")
	.get(getMessage)
	.delete(deleteMessage);
*/
module.exports = router;



/*
const myRouter = express.Router( {mergeParams: true} );
exports = myRouter.route("/messages/:id").get(getMessagesAll);
*/
