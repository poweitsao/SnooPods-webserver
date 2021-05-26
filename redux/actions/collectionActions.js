const storeCollections = (collections) => {
    // console.log("storing queue info to redux", QueueInfo)
    console.log("storing collections info to redux")

    return {
        type: "STORE_COLLECTIONS",
        collections
    }
}


module.exports = { 
    storeCollections
 }