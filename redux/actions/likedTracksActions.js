const storeLikedTracks = (likedTracks, collectionID) => {
    // console.log("storing likedTracks info to redux")

    return {
        type: "STORE_LIKED_TRACKS",
        likedTracks,
        collectionID
    }
}

const emptyLikedTracks = () => {

    return {
        type: "EMPTY_LIKED_TRACKS_STORE"
    }
}


module.exports = { 
    storeLikedTracks,
    emptyLikedTracks
 }