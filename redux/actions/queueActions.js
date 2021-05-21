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

const removeTrackFromCurrentPlaylist = (trackID) => {
    return {
        type: "REMOVE_TRACK_FROM_CURRENT_PLAYLIST",
        trackID
    }
}


const removePlaylistFromQueue = (playlistID) => {
    return {
        type: "REMOVE_PLAYLIST_FROM_QUEUE",
        playlistID
    }
}

const removeTrackFromQueue = (trackID, index) => {
    return {
        type: "REMOVE_TRACK_FROM_QUEUE",
        trackID,
        index

    }
}