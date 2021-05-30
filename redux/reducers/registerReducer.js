import { storeRegisterationInfo } from "../actions/index"

const emptyUserInfo = {
    userInfo: {}
}
const initialState = emptyUserInfo

const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "STORE_REGISTERATION_INFO":
            return Object.assign({}, state, {
                registered: action.userInfo.registered,
                payload: action.userInfo.verification.payload,
                userID: action.userInfo.userID
            })

        case "EMPTY_REGISTERATION_STORE":
            return initialState

        default:
            return state

    }
}

export default registerReducer
