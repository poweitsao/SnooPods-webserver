
const emptyHistoryList = {
    History: []
}

const initialState = emptyHistoryList

let assignCollections = function(history: Array<string>) {
    return Object.assign({}, { History: history })
}

const historyReducer = (state = initialState, action) => {
    

    switch (action.type) {
        case "STORE_HISTORY":
            return assignCollections(action.history)

        case "ADD_TO_HISTORY":
            var newHistory = state.History
            newHistory.push(action.newTrack)
            // console.log("newHistory", newHistory)
            if (newHistory.length > 10){
                newHistory.shift()
            }
            
            return {
                ...state,
                History: newHistory
            }

        case "EMPTY_HISTORY_STORE":
            return emptyHistoryList

        default:
            return state
    }
}



export default historyReducer;

