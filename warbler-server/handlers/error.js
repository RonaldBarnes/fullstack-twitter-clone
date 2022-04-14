
// Models in the singular, handlers in the plural.
// Lecture 363 @ 00:10
// Where it makes sense, I guess. He has handlers/auth.js and handlers/error.js

function errorHandler( error, req, res, next) {
	// Middleware
	console.log(`errorHandler():`,
		`\n status:   ${error.status}`,
		`\n message:  ${error.message}`,
		`\n location: ${error.location}`
		);

	return res.status(error.status || 500).json({
		error: {
			message: error.message  || "Something went wrong (handlers/error.js)",
			status: error.status || 500,
			location: error.location || "handlers/error.js::errorHandler()",
			code: error.code || "",
			}
		});
	}


module.exports = errorHandler;

