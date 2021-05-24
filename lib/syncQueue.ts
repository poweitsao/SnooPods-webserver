import {QueueStore} from "../redux/store"
const syncDB = async (email: string) =>{
    const currStore =QueueStore.getState()
    var res = await fetch("/api/queue/pushQueueToDB", {method: "POST", body: JSON.stringify({email: email, queueInfo: currStore.QueueInfo})})
  }

export default syncDB
  