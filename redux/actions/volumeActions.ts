export const storeVolume = (volume) => {

    return {
        type: "STORE_VOLUME",
        volume
    }
}

export const updateVolume = (newVolume) => {
    return{
        type: "UPDATE_VOLUME",
        newVolume
    }
}

export const emptyVolume = () => {
    // console.log("storing queue info to redux", QueueInfo)

    return {
        type: "EMPTY_VOLUME"
    }
}

module.exports = { 
    storeVolume,
    updateVolume,
    emptyVolume
 }