import { combineReducers } from 'redux';
import userInfoReducer from "./userInfoReducer"

const rootReducer = combineReducers({
    userInfo: userInfoReducer
});

export default rootReducer;