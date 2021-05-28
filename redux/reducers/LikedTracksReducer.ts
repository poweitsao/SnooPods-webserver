

const initialState = {
    LikedTracks: []
}

let assignLikedTracks = function(tracks: Array<string>) {
    return Object.assign({}, { LikedTracks: tracks })
}

const LikedTracksReducer = (state = initialState, action) => {
    

    switch (action.type) {
        //! only called when putting db queue info into redux
        case "STORE_LIKED_TRACKS":
            return assignLikedTracks(
                action.likedTracks)
        default:
            return state
    }
}

export default LikedTracksReducer;

