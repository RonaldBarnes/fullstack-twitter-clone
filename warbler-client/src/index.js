import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
// Working authentication test prototype:
// import TestAuth from "./TestAuth";

import './index.css';
// Is this now bundled by default?
// import registerServiceWorker from "./registerServiceWorker";


ReactDOM.render(
	<App />,
	/*	<TestAuth />,	*/
	document.getElementById('root')
	);
