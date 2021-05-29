const storeLikedTracks = (likedTracks, collectionID) => {
    console.log("storing likedTracks info to redux")

    return {
        type: "STORE_LIKED_TRACKS",
        likedTracks,
        collectionID
    }
}


module.exports = { 
    storeLikedTracks
 }