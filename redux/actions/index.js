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

module.exports = { storeUserInfo, storeAudioPlayerInfo }