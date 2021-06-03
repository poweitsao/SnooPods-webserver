import { Track } from "../../ts/interfaces"

const emptyHistoryList = {
    History: []
}

const initialState = emptyHistoryList

let assignCollections = function(history: Array<Track>) {
    return Object.assign({}, { History: history })
}

const historyReducer = (state = initialState, action) => {
    

    switch (action.type) {
        case "STORE_HISTORY":
            return assignCollections(action.history)

        case "ADD_TO_HISTORY":
            if( action.newTrack== null || action.newTrack== undefined){
                return state
            } else{
                var newHistory: Array<Track> = state.History
                newHistory = newHistory.filter((track: Track) => {
                    return track.track_id !== action.newTrack.track_id
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

            var newHistory: Array<Track> = state.History
            // var lastTrack = newHistory[newHistory.length - 1]
            if (newHistory.length > 0){
                newHistory.pop()
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

