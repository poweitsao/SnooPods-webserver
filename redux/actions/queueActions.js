const storeQueueInfo = (QueueInfo) => {
    // console.log("storing queue info to redux", QueueInfo)
    console.log("storing queue info to redux")

    return {
        type: "STORE_QUEUE_INFO",
        QueueInfo
    }
}

const getQueueInfo = () =>{
    return{
        type: "GET_QUEUE_INFO"
    }
}

const pushNextTrack = () => {
    console.log("pushing next track!")
    return {
        type: "PUSH_NEXT_TRACK"
    }
}

const replaceCurrentTrack = (track) =>{
    console.log("replacing current track with", track)
    return {
        type: "REPLACE_CURRENT_TRACK",
        track
    }
}

const replaceCurrentPlaylist = (newPlaylist) =>{
    console.log("replacing current playlist with", newPlaylist)
    return {
        type: "REPLACE_CURRENT_PLAYLIST",
        newPlaylist
    }
}

const addPlaylistToQueue = (newPlaylist) => {
    console.log("adding new playlist to queue", newPlaylist.playlistID)
    return {
        type: "ADD_PLAYLIST_TO_QUEUE",
        newPlaylist
    }
}

const clearCurrentPlaylist = () => {
    console.log("clearing current playlist")
    return {
        type: "CLEAR_CURRENT_PLAYLIST"
    }
}

const removeTrackFromCurrentPlaylist = (trackID, index) => {
    console.log("removing track", trackID, "from current playlist")
    return {
        type: "REMOVE_TRACK_FROM_CURRENT_PLAYLIST",
        trackID,
        index
    }
}


const removePlaylistFromQueue = (playlistID) => {
    console.log("removing playlist", playlistID, "from queue")

    return {
        type: "REMOVE_PLAYLIST_FROM_QUEUE",
        playlistID
    }
}

const removeTrackFromQueue = (playlistID, trackID, index) => {
    console.log("removing track", trackID, "from playlist", playlistID, "from queue")

    return {
        type: "REMOVE_TRACK_FROM_QUEUE",
        playlistID,
        trackID,
        index

    }
}

const emptyQueue = () => {
    return {
        type:"EMPTY_QUEUE_STORE"
    }
}

module.exports = { 
    storeQueueInfo,
    getQueueInfo,
    pushNextTrack,
    replaceCurrentTrack,
    addPlaylistToQueue,
    clearCurrentPlaylist,
    removeTrackFromCurrentPlaylist,
    removePlaylistFromQueue,
    removeTrackFromQueue,
    replaceCurrentPlaylist,
    emptyQueue
 }