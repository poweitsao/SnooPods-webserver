import { Track } from "../../ts/interfaces"

const emptyVolume = {
    volume: 1
}

const initialState = emptyVolume

let assignVolume = function(volume: number) {
    return Object.assign({}, { volume: volume })
}

const volumeReducer = (state = initialState, action) => {
    

    switch (action.type) {
        case "STORE_VOLUME":
            return assignVolume(action.volume)

        case "UPDATE_VOLUME":
            return {
                ...state,
                volume: action.newVolume
            }

        case "EMPTY_VOLUME":
            return emptyVolume
            


        default:
            return state
    }
}



export default volumeReducer;

