import { storeAudioPlayerInfo } from "../actions"

const initialState = {
    AudioPlayerInfo: {}
}

const audioPlayerInfoReducer = (state = initialState, action) => {
    // console.log("action:", action)
    switch (action.type) {
        case "STORE_AUDIO_PLAYER_INFO":
            return Object.assign({}, state, {
                playing: action.AudioPlayerInfo.playing,
                subreddit: action.AudioPlayerInfo.subreddit,
                filename: action.AudioPlayerInfo.filename,
                trackName: action.AudioPlayerInfo.trackName,
                audio: action.AudioPlayerInfo.audio,
                url: action.AudioPlayerInfo.url,
                playlist: action.AudioPlayerInfo.playlist,
                keyIndex: action.AudioPlayerInfo.keyIndex
            })
        case "TOGGLE_PLAYING":
            return {
                ...state,
                playing: action.playingStatus
            }
        case "NEXT_TRACK":
            return {
                ...state
            }
        default:
            return state
    }
}

export default audioPlayerInfoReducer;

// const userInfoReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case "STORE_USER_INFO":
//             return Object.assign({}, state, {
//                 registered: action.userInfo.registered,
//                 payload: action.userInfo.verification.payload,
//                 userID: action.userInfo.userID
//             })
//         default:
//             return state
//     }
// }

// export default userInfoReducer
