import {Track, QueuePlaylist, QueueObject} from "../../ts/interfaces"

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

const emptySubListList = {
    SubLists: []
}

const initialState = emptySubListList

let assignSubLists = function(subLists) {
    return Object.assign({}, { SubLists: subLists })
}

const subListReducer = (state = initialState, action) => {
    

    switch (action.type) {
        case "STORE_SUBLISTS":
            return assignSubLists(
                action.subLists)

        case "EMPTY_SUBLIST_STORE":
            return emptySubListList

        default:
            return state
    }
}



export default subListReducer;

