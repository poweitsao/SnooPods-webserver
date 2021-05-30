import {Track, QueuePlaylist, QueueObject} from "../../ts/interfaces"
import {QueueStore} from "../store"

const emptyPlaylist : QueuePlaylist= {
    playlistID: "",
    playlistName: "",
    tracks: []
}

const emptyTrack : Track= {
    filename: "",
    cloud_storage_url: "",
    date_posted: {
        _seconds: 0,
        _nanoseconds: 0
    },
    audio_length: 0,
    track_name: "",
    track_id: ""
}

const emptyCollectionList = {
    Collections: []
}

const initialState = emptyCollectionList

let assignCollections = function(collections) {
    return Object.assign({}, { Collections: collections })
}

const collectionReducer = (state = initialState, action) => {
    

    switch (action.type) {
        //! only called when putting db queue info into redux
        case "STORE_COLLECTIONS":
            return assignCollections(
                action.collections)

        case "EMPTY_COLLECTION_STORE":
            return emptyCollectionList

        default:
            return state
    }
}



export default collectionReducer;

