const storeCollections = (collections) => {
    return {
        type: "STORE_COLLECTIONS",
        collections
    }
}

const emptyCollections = () => {
    // console.log("storing queue info to redux", QueueInfo)

    return {
        type: "EMPTY_COLLECTION_STORE"
    }
}

module.exports = { 
    storeCollections,
    emptyCollections
 }