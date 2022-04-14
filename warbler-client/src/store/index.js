

// Lecture 370 @ 00:45
import rootReducer from "./reducers/index";
// Above is same as following, which is more explicit:
// import rootReducer from "./reducers/index.js";


// compose compose is to allow us to combine functions together,
// useful for 2nd parameter of createStore
//
// applyMiddleWare for "thunk" middleware, essential for async
import { createStore, applyMiddleware, compose } from "redux";

// thunk allows us to delay evaluation of some expression, needed for async:
import thunk from "redux-thunk";



export function configureStore() {
	const store = createStore(
		rootReducer,
		compose(applyMiddleware(thunk),
			// Redux debug tools:
			// https://github.com/zalmoxisus/redux-devtools-extension#usage
			window.__REDUX_DEVTOOLS_EXTENSION__
				&& window.__REDUX_DEVTOOLS_EXTENSION__()
			// window.devToolsExtension ? window.devToolsExtension() : f => f
			));
	return store;
	};

