import { nextTrack, storeAudioPlayerInfo } from "../actions"
import {Track, QueuePlaylist, QueueObject, UserSession} from "../../ts/interfaces"


const emptyUserSession : UserSession  = {
    sessionID: "", 
    email: "",
    firstName: "",
    lastName: "",
    pictureURL: "",
    validSession: false
}


const initialState : UserSession  = emptyUserSession

let assignUserSessionObject = function(sessionID: string, 
                                    email: string,
                                    firstName: string,
                                    lastName: string,
                                    pictureURL: string,
                                    validSession?: boolean ) {
    return Object.assign({}, {
        sessionID, 
        email,
        firstName,
        lastName,
        pictureURL,
        validSession
    })
}

const userSessionInfoReducer = (state = initialState, action) => {
    
    // console.log("action", action)
    switch (action.type) {
        case "STORE_USER_SESSION_INFO":
            return assignUserSessionObject(
                action.userSession.sessionID,
                action.userSession.email,
                action.userSession.firstName,
                action.userSession.lastName,
                action.userSession.pictureURL,
                action.userSession.validSession
                )
        case "EMPTY_USER_SESSION_STORE":
            return emptyUserSession
            
        default:
            return state
    }
}

export default userSessionInfoReducer;

