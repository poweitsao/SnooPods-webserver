const storeHistory = (history) => {
    console.log("storing history info to redux")

    return {
        type: "STORE_HISTORY",
        history
    }
}

const addToHistory = (newTrack) => {
    console.log("addTohistory", newTrack)
    return {
        type: "ADD_TO_HISTORY",
        newTrack
    }
}

const emptyHistory = () => {

    return {
        type: "EMPTY_HISTORY_STORE"
    }
}

module.exports = { 
    storeHistory,
    emptyHistory,
    addToHistory
 }