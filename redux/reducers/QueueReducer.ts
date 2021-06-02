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


const emptyQueueStore = {
    QueueInfo:<QueueObject> {
        currentTrack: emptyTrack,
        currentPlaylist: emptyPlaylist,
        queue: []
    }
}

const initialState = emptyQueueStore


let assignQueueObject = function(currentTrack: Track, currentPlaylist: QueuePlaylist, queue: Array<QueuePlaylist>) {
    return Object.assign({}, 
        {QueueInfo:{
            currentTrack, 
            currentPlaylist, 
            queue
        }
    })
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
        
        case "GET_QUEUE_INFO":
            return state

        case "PUSH_NEXT_TRACK":
            // const currStore =store.getState().queueInfo
            // console.log("currStore", currStore)

            // console.log("state", state)
            var currentPlaylist = state.QueueInfo.currentPlaylist
            var queue = state.QueueInfo.queue
            var nextTrack = {}
            if (currentPlaylist.tracks.length == 0){
                if (queue.length > 0){
                    nextTrack = queue[0].tracks[0]
                    queue[0].tracks.shift()
                    if(queue[0].tracks.length == 0){
                        queue.shift()
                    }
                } else{
                    nextTrack = emptyTrack
                }
                
            } else{
                nextTrack = currentPlaylist.tracks[0]
                currentPlaylist.tracks.shift()
            }
            
            return {
                QueueInfo:{
                    currentTrack: nextTrack,
                    currentPlaylist: currentPlaylist,
                    queue: queue
                }
                
            }
        case "REPLACE_CURRENT_TRACK":

            return{
                QueueInfo:{
                    ...state.QueueInfo,
                    currentTrack: action.track
                }
                
            }

        case "REPLACE_CURRENT_PLAYLIST":

            return{
                QueueInfo:{
                    ...state.QueueInfo,
                    currentPlaylist: action.newPlaylist
                }
                
            }

        case "ADD_PLAYLIST_TO_QUEUE":
            var queue = state.QueueInfo.queue
            var newPlaylist = action.newPlaylist
            var currentTrack = state.QueueInfo.currentTrack
            if (currentTrack.cloud_storage_url == "" ){
                currentTrack = newPlaylist.tracks[0]
                newPlaylist.tracks.shift()
            }
            if (newPlaylist.tracks.length > 0){
                queue.push(newPlaylist)
            }
            return {
                QueueInfo:{
                    ...state.QueueInfo,
                    queue: queue,
                    currentTrack: currentTrack
                }
            }

        case "CLEAR_CURRENT_PLAYLIST":
            return {
                QueueInfo:{
                    ...state.QueueInfo,
                    currentPlaylist: emptyPlaylist
                }
            }

        case "REMOVE_TRACK_FROM_CURRENT_PLAYLIST":
            var currentPlaylist = state.QueueInfo.currentPlaylist
            var trackID = action.trackID
            var trackIndex = action.index
            var filteredTracks = currentPlaylist.tracks.filter(
                (track, index) => {return track.track_id !== trackID || index !== trackIndex})
            currentPlaylist.tracks = filteredTracks
            return {
                QueueInfo:{
                    ...state.QueueInfo,
                    currentPlaylist: currentPlaylist
                }
            }

        case "REMOVE_PLAYLIST_FROM_QUEUE":
            var playlistID = action.playlistID
            var queue = state.QueueInfo.queue
            queue = queue.filter((playlist) => {return playlist.playlistID !== playlistID})
            return {
                QueueInfo:{
                    ...state.QueueInfo,
                    queue: queue
                }
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
            var filteredQueue = queue.filter(
                (playlist, index) => { return playlist.tracks.length > 0}
            )
            queue = filteredQueue

            return {
                QueueInfo:{
                    ...state.QueueInfo,
                    queue: queue
                }
            }

        case "EMPTY_QUEUE_STORE":
            return emptyQueueStore

        default:
            return state
    }
}

export default queueInfoReducer;

