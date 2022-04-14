
const express = require("express");

const router = express.Router();

const {
	deleteUser,
	listUser,
	listUsersAll
	} = require("../handlers/users");


// Delete user via DELETE method:
router
	.route("/api/user/:userid")
	.delete(deleteUser)
	;
/*
// Following works, but replaced by more specific code ABOVE.
// WORKS:
router.route("/api/user/:userid/delete")
	.all(deleteUser)
*/
router.route("/api/user/all/list")
	.all(listUsersAll)
router.route("/api/user/:userid/list")
	.all(listUser)

module.exports = router;

