const storeSubLists = (subLists) => {
    // console.log("storing queue info to redux", QueueInfo)
    console.log("storing subLists info to redux")

    return {
        type: "STORE_SUBLISTS",
        collections
    }
}

const emptySubLists = () => {
    // console.log("storing queue info to redux", QueueInfo)

    return {
        type: "EMPTY_SUBLIST_STORE"
    }
}

module.exports = { 
    storeSubLists,
    emptySubLists
 }