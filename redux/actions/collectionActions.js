const storeCollections = (collections) => {
    // console.log("storing queue info to redux", QueueInfo)
    console.log("storing collections info to redux")

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