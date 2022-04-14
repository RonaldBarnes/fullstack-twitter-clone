
import
	{
	ADD_ERROR,
	REMOVE_ERROR
	} from "../actionTypes";

// See lecture 369 @ 03:20
export default (state = {message: null}, action) => {
	switch(action.type) {
		case ADD_ERROR:
			return {...state, message: action.error};
		case REMOVE_ERROR:
			return {...state, message: null};
		default:
			return state;
		}
	};

