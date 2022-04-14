
// Handy, small AJAX library:
// Requires HTTP methods to be lower case!
import axios from "axios";



// Lecture 378 @ 01:50 is a peek at code, not explained at all yet
// Lecture 382 @ 05:00 revisits and types in this code:
// used in store/actions/auth.js
export function setTokenHeader(token)
	{
	if (token)
		{
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		}
	else
		{
		delete axios.defaults.headers.common["Authorization"];
		}
	}



// Lecture 377 @ 01:20

export function apiCall(method, path, data) {
	console.log(`api.js apiCall()\n method: ${method},\n`,
		` path: ${path},\n`,
		` data:`, data);
	// return new Promise (per ECMA 2015, Promise accepts function):
	return new Promise( (resolve, reject) => {
		// axios[method] not axios.method because "method" needs to be evaluated:
		// i.e. calls axios.get or axios.post depending on "method"
		// Which will then "return to us a function, so we'll invoke that function"
		// 377 @ 01:45
		return axios[method.toLowerCase()](path, data)
			.then(res => {
				return resolve(res.data);
				})
			.catch(err => {
				// Response from axios comes in an object called response, then
				// sub-object called data
				return reject(err.response.data.error);
				});
		});
	}

