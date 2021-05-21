import { nextTrack, storeAudioPlayerInfo } from "../actions"

const initialState = {
    QueueInfo: {}
}

const queueInfoReducer = (state = initialState, action) => {
    // console.log("action:", action)
    switch (action.type) {
        //! only called when putting db queue info into redux
        case "STORE_QUEUE_INFO":
            return Object.assign({}, state, {
                //? currentTrack = {trackID, trackName...}
                currentTrack: action.QueueInfo.currentTrack,
                //? currentPlaylist = {playlistID, playlistName, tracks[]...}
                currentPlaylist: action.QueueInfo.currentPlaylist,
                //? queue = [ {playlist1}, {playlist2}... ]
                queue: action.QueueInfo.queue
            })
        case "PUSH_NEXT_TRACK":
            let currentPlaylist = state.currentPlaylist
            let queue = state.queue
            let nextTrack = {}
            if (currentPlaylist.tracks.length == 0){
                nextTrack = queue[0].tracks[0]
                queue[0].tracks.shift()
            } else{
                nextTrack = currentPlaylist.tracks[0]
                currentPlaylist.tracks.shift()
            }
            
            return {
                currentTrack: nextTrack,
                currentPlaylist: currentPlaylist,
                queue: queue
            }
        case "REPLACE_CURRENT_TRACK":

            return{
                ...state,
                currentTrack: action.track
            }

        case "ADD_PLAYLIST_TO_QUEUE":
            let queue = state.queue
            queue.unshift(action.newPlaylist)
            return {
                ...state,
                queue: queue
            }
        case "CLEAR_CURRENT_PLAYLIST":
            return {
                //!
            }
        case "REMOVE_TRACK_FROM_CURRENT_PLAYLIST":
            return {
                //!
            }

        case "REMOVE_PLAYLIST_FROM_QUEUE":
            let playlistID = action.playlistID
            let queue = state.queue
            queue = queue.filter((playlist) => {return playlist.playlistID != playlistID})
            return {
                ...state,
                queue: queue

            }
        case "REMOVE_TRACK_FROM_QUEUE":
            let trackID = action.trackID
            let queue = state.queue
            for (var i = 0; i < queue.length; i++){
                let currQueuePlaylist = queue[i]
                let filteredTracks = currQueuePlaylist.tracks.filter(
                    (track) => {return track.trackID != trackID})
                queue[i].tracks = filteredTracks
            }
            return {
                // ...state
            }
        default:
            return state
    }
}

export default queueInfoReducer;

