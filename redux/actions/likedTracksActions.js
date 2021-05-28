const storeLikedTracks = (likedTracks) => {
    console.log("storing likedTracks info to redux")

    return {
        type: "STORE_LIKED_TRACKS",
        likedTracks
    }
}


module.exports = { 
    storeLikedTracks
 }