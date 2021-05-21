import { nextTrack, storeAudioPlayerInfo } from "../actions"
import {Track, QueuePlaylist, QueueObject} from "../../ts/interfaces"


const emptyPlaylist : QueuePlaylist= {
    playlistID: "",
    playlistName: "",
    tracks: []
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


const initialState = {
    QueueInfo:<QueueObject> {
        currentTrack: emptyTrack,
        currentPlaylist: emptyPlaylist,
        queue: []
    }
}

let assignQueueObject = function(currentTrack: Track, currentPlaylist: QueuePlaylist, queue: Array<QueuePlaylist>) {
    return Object.assign({}, currentTrack, currentPlaylist, queue)
}

const queueInfoReducer = (state = initialState, action) => {


    switch (action.type) {
        //! only called when putting db queue info into redux
        case "STORE_QUEUE_INFO":
            // return Object.assign({}, state, {
            //     //? currentTrack = {trackID, trackName...}
            //     currentTrack: action.QueueInfo.currentTrack,
            //     //? currentPlaylist = {playlistID, playlistName, tracks[]...}
            //     currentPlaylist: action.QueueInfo.currentPlaylist,
            //     //? queue = [ {playlist1}, {playlist2}... ]
            //     queue: action.QueueInfo.queue
            // })
            return assignQueueObject(
                action.QueueInfo.currentTrack, 
                action.QueueInfo.currentPlaylist, 
                action.QueueInfo.queue)

        case "PUSH_NEXT_TRACK":
            var currentPlaylist = state.QueueInfo.currentPlaylist
            var queue = state.QueueInfo.queue
            var nextTrack : Track
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
            var queue = state.QueueInfo.queue
            queue.unshift(action.newPlaylist)
            return {
                ...state,
                queue: queue
            }

        case "CLEAR_CURRENT_PLAYLIST":
            return {
                ...state,
                currentPlaylist: emptyPlaylist
            }

        case "REMOVE_TRACK_FROM_CURRENT_PLAYLIST":
            var currentPlaylist = state.QueueInfo.currentPlaylist
            var trackID = action.trackID
            var trackIndex = action.index
            var filteredTracks = currentPlaylist.tracks.filter(
                (track, index) => {return track.track_id !== trackID || index !== trackIndex})
            currentPlaylist.tracks = filteredTracks
            return {
                ...state,
                currentPlaylist: currentPlaylist
            }

        case "REMOVE_PLAYLIST_FROM_QUEUE":
            var playlistID = action.playlistID
            var queue = state.QueueInfo.queue
            queue = queue.filter((playlist) => {return playlist.playlistID !== playlistID})
            return {
                ...state,
                queue: queue

            }
            
        case "REMOVE_TRACK_FROM_QUEUE":
            var trackID = action.trackID
            var trackIndex = action.index
            var playlistID = action.playlistID
            var queue = state.QueueInfo.queue
            for (var i = 0; i < queue.length; i++){
                var currQueuePlaylist = queue[i]
                if (currQueuePlaylist.playlistID == playlistID){
                    var filteredTracks = currQueuePlaylist.tracks.filter(
                        (track, index) => {return track.track_id !== trackID || index !== trackIndex})
                    queue[i].tracks = filteredTracks
                }
            }
            return {
                ...state,
                queue: queue
            }
        default:
            return state
    }
}

export default queueInfoReducer;

