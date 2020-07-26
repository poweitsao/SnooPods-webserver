const storeUserInfo = (userInfo) => {
    return {
        type: "STORE_USER_INFO",
        userInfo
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

module.exports = { storeUserInfo, storeAudioPlayerInfo, togglePlaying }