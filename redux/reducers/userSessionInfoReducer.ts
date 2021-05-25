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


const emptyTrack : Track= {
    filename: "",
    cloud_storage_url: "",
    date_posted: {
        _seconds: 0,
        _nanoseconds: 0
    },
    audio_length: 0,
    track_name: "",
    track_id: ""
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
        
        default:
            return state
    }
}

export default userSessionInfoReducer;

