
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
            if(action.newTrack == ""){
                return state
            } else{
                var newHistory = state.History
                newHistory = newHistory.filter((trackID) => {
                    return trackID !== action.newTrack
                })

                newHistory.push(action.newTrack)
                // console.log("newHistory", newHistory)
                if (newHistory.length > 10){
                    newHistory.shift()
                }
                
                return {
                    ...state,
                    History: newHistory
                }
            }

        case "REMOVE_LAST_TRACK":

            var newHistory = state.History
            // var lastTrack = newHistory[newHistory.length - 1]
            newHistory.pop()
            
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

