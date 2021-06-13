const storeRegisterationInfo = (userInfo) => {
    return {
        type: "STORE_REGISTERATION_INFO",
        userInfo
    }
}

const emptyRegisterationInfo = () => {
    return {
        type: "EMPTY_REGISTERATION_STORE"
    }
}

const storeAudioPlayerInfo = (AudioPlayerInfo) => {
    return {
        type: "STORE_AUDIO_PLAYER_INFO",
        AudioPlayerInfo
    }
}

const togglePlaying = (playingStatus) => {
    return {
        type: "TOGGLE_PLAYING",
        playingStatus
    }
}

const setAudioStoreEmail = (email) => {
    console.error("audio store set email called. is deprecated")
    return {
        type: "SET_AUDIO_STORE_EMAIL",
    }
}

const nextTrack = (AudioPlayerInfo) => {
    return {
        type: "NEXT_TRACK",
        AudioPlayerInfo
    }
}

const emptyAudioStore = () => {
    return {
        type: "EMPTY_AUDIO_STORE"
    }
}

module.exports = { 
    storeRegisterationInfo, 
    emptyRegisterationInfo,
    storeAudioPlayerInfo, 
    togglePlaying, 
    nextTrack, 
    setAudioStoreEmail, 
    emptyAudioStore 
}