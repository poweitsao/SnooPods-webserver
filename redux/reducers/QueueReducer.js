import { storeAudioPlayerInfo } from "../actions"

const initialState = {
    QueueInfo: {}
}

const queueInfoReducer = (state = initialState, action) => {
    // console.log("action:", action)
    switch (action.type) {
        case "STORE_QUEUE_INFO":
            return Object.assign({}, state, {
                // playing: action.AudioPlayerInfo.playing,
                // subreddit: action.AudioPlayerInfo.subreddit,
                // filename: action.AudioPlayerInfo.filename,
                // trackName: action.AudioPlayerInfo.trackName,
                // audio: action.AudioPlayerInfo.audio,
                // url: action.AudioPlayerInfo.url,
                // playlist: action.AudioPlayerInfo.playlist,
                // keyIndex: action.AudioPlayerInfo.keyIndex
            })
        case "GET_NEXT_TRACK":
            return {
                ...state,
                playing: action.playingStatus
            }
        case "ADD_PLAYLIST_TO_QUEUE":
            return {
                ...state
            }
        case "DELETE_PLAYLIST_FROM_QUEUE":
            return {
                ...state
            }
        case "DELETE_TRACK_FROM_QUEUE":
            return {
                ...state
            }
        default:
            return state
    }
}

export default queueInfoReducer;

