
const express = require("express");

const router = express.Router();

const { signup, signin } = require("../handlers/auth");

// May change to ../handlers/users:
// const deleteUser = require("../handlers/auth");


// Elie has "POST", I've changed to "ALL" for easier testing:
router.post("/signup", signup);
router.post("/signin", signin);
// router.get("/signin", signin);



module.exports = router;

