
const emptyLikedTracks = {
    LikedTracks: []
}

const initialState = emptyLikedTracks

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

        case "EMPTY_LIKED_TRACKS_STORE":
            return emptyLikedTracks

        default:
            return state
    }
}

export default LikedTracksReducer;

