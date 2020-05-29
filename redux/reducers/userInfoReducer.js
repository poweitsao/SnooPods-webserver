import { storeUserInfo } from "../actions"

const initialState = {
    userInfo: {}
}


const userInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case "STORE_USER_INFO":
            return Object.assign({}, state, {
                registered: action.userInfo.registered,
                payload: action.userInfo.verification.payload,
                userID: action.userInfo.userID
            })
        default:
            return state
    }
}

export default userInfoReducer
