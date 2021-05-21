const storeQueueInfo = (QueueInfo) => {
    return {
        type: "STORE_QUEUE_INFO",
        QueueInfo
    }
}

const pushNextTrack = () => {
    return {
        type: "PUSH_NEXT_TRACK"
    }
}

const replaceCurrentTrack = (track) =>{
    return {
        type: "REPLACE_CURRENT_TRACK",
        track
    }
}

const addPlaylistToQueue = (newPlaylist) => {
    return {
        type: "ADD_PLAYLIST_TO_QUEUE",
        newPlaylist
    }
}

const clearCurrentPlaylist = () => {
    return {
        type: "CLEAR_CURRENT_PLAYLIST"
    }
}

const removeTrackFromCurrentPlaylist = (trackID, index) => {
    return {
        type: "REMOVE_TRACK_FROM_CURRENT_PLAYLIST",
        trackID,
        index
    }
}


const removePlaylistFromQueue = (playlistID) => {
    return {
        type: "REMOVE_PLAYLIST_FROM_QUEUE",
        playlistID
    }
}

const removeTrackFromQueue = (playlistID, trackID, index) => {
    return {
        type: "REMOVE_TRACK_FROM_QUEUE",
        playlistID,
        trackID,
        index

    }
}