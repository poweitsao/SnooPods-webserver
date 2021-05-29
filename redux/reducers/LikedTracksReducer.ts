

const initialState = {
    LikedTracks: []
}

let assignLikedTracks = function(tracks: Array<string>, collectionID: string) {
    return Object.assign({}, { LikedTracks: tracks, likedTracksCollectionID: collectionID })
}

const LikedTracksReducer = (state = initialState, action) => {
    

    switch (action.type) {
        //! only called when putting db queue info into redux
        case "STORE_LIKED_TRACKS":
            return assignLikedTracks(
                action.likedTracks,
                action.collectionID)
        default:
            return state
    }
}

export default LikedTracksReducer;

