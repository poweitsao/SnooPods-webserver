import { Track } from "../../ts/interfaces"

export const storeHistory = (history: Array<Track>) => {
    console.log("storing history info to redux")

    return {
        type: "STORE_HISTORY",
        history
    }
}

export const addToHistory = (newTrack: Track) => {
    console.log("addTohistory", newTrack)
    return {
        type: "ADD_TO_HISTORY",
        newTrack
    }
}

export const removeLastTrack = () => {
    return{
        type: "REMOVE_LAST_TRACK"
    }
}

export const emptyHistory = () => {

    return {
        type: "EMPTY_HISTORY_STORE"
    }
}

module.exports = { 
    storeHistory,
    emptyHistory,
    addToHistory,
    removeLastTrack
 }