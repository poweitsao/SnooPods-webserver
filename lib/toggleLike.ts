import { trigger } from "swr"
import store from "../redux/store"
import { Track } from "../ts/interfaces"

const toggleLike = async (track: Track, likedTracksCollectionID: string) => {
    // console.log("toggling like for:", track.track_id)
    let email = store.getState().userSessionInfo.email
    await fetch("/api/user/collections/likedTracks/toggleLike", 
        {method: "POST", 
        body: JSON.stringify({email: email, trackID: track.track_id })})
    trigger("/api/user/collections/likedTracks/get/"+ email)
    trigger("/api/user/collections/get/" + email + "/" + likedTracksCollectionID)

}

export default toggleLike;