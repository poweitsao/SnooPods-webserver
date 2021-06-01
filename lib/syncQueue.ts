import store from "../redux/store"
import { storeQueueInfo } from "../redux/actions/queueActions"
import {storeAudioPlayerInfo} from "../redux/actions/index"
import { Track } from "../ts/interfaces"


export async function syncDB () {
  let email = store.getState().userSessionInfo.email
  if (email !== ""){
    // console.log("sync queue", email)
    const currStore = store.getState().queueInfo
    // console.log("syncQueue currStore.QueueInfo", currStore.QueueInfo)
    var res = await fetch("/api/queue/pushQueueToDB",
      { method: "POST", body: JSON.stringify({ email: email, queueInfo: currStore.QueueInfo }) })
  } else{
    console.error("email is empty in syncDB")
  }
}


export async function getQueue (email: string) {
  const getQueueRes = await fetch("/api/queue/getQueue/", {
    method: "POST", body: JSON.stringify({ email: email })
  })
  let userQueueInfo = await getQueueRes.json()
  // console.log("getQueue result:", userQueueInfo)

  // let currTrackInfo = {}
  let currTrack: Track
  let currentPlaylist = userQueueInfo.currentPlaylist
  let queue = userQueueInfo.queue

  if (userQueueInfo.currentTrack.length == 0) {
    if (currentPlaylist.tracks.length == 0) {
      // get first track from queue
      if (queue.length == 0) {
        // nothing in queue. show empty player
        console.log("currentTrack, currPlaylist and queue are empty in db.")

      } else {
        console.log("currentTrack and currPlaylist are empty in db. grabbing currTrack from queue")

        currTrack = queue[0].tracks[0]
        // const trackRes = await fetch("/api/getTrack/" + currTrack, {method: "GET"})
        // currentTrackInfo = await trackRes.json()
        // console.log("currentTrack", currentTrackInfo)
        queue[0].tracks.shift()
      }

    } else {
      console.log("currentTrack is empty in db. grabbing currTrack from currPlaylist")
      currTrack = currentPlaylist.tracks[0]
      // const trackRes = await fetch("/api/getTrack/" + currTrack, {method: "GET"})
      // currentTrackInfo = await trackRes.json()
      // console.log("currentTrack", currentTrackInfo)
      currentPlaylist.tracks.shift()
    }
  } else {
    // const trackRes = await fetch("/api/getTrack/" + userQueueInfo.currentTrack, {method: "GET"})
    // currentTrackInfo = await trackRes.json()
    // console.log("currentTrack", currentTrackInfo)
    currTrack = userQueueInfo.currentTrack

  }

  QueueStore.dispatch(
    storeQueueInfo({
      currentTrack: currTrack,
      currentPlaylist: currentPlaylist,
      queue: queue
    })
  )

  let currAudioStore = store.getState().audioPlayerInfo
  // console.log("currAudioStore", currAudioStore)
  if (currAudioStore.audio == "" && currTrack.cloud_storage_url !== "") {
    AudioPlayerStore.dispatch(
      storeAudioPlayerInfo({
        playing: false,
        subreddit: "loremipsum",
        trackName: currTrack.track_name,
        filename: currTrack.filename,
        audio: new Audio(currTrack.cloud_storage_url),
        url: currTrack.cloud_storage_url
      })
    );
  } 
  // else if (currAudioStore.email == ""){
  //   // console.log("email in setAudioStoreEmail", email)
  //   AudioPlayerStore.dispatch(
  //     setAudioStoreEmail({
  //       email
  //     })
  //   );
  // }

  return {  currentTrack: currTrack,
            currentPlaylist: currentPlaylist,
            queue: queue  }

}

export function syncQueueWithAudioPlayer(playing: boolean) {
  let audioCurrStore = store.getState().audioPlayerInfo
  let queueCurrStore = store.getState().queueInfo
  
  if (audioCurrStore.url !== queueCurrStore.QueueInfo.currentTrack.cloud_storage_url){
    var currTrack = queueCurrStore.QueueInfo.currentTrack
    AudioPlayerStore.dispatch(storeAudioPlayerInfo({
      playing: playing,
      subreddit: "r/LoremIpsum",
      filename: currTrack.filename,
      trackName: currTrack.track_name,
      audio: new Audio(currTrack.cloud_storage_url),
      url: currTrack.cloud_storage_url,
    }))
  }
}

export function forceSyncQueueWithAudioPlayer(playing: boolean) {
  let queueCurrStore = store.getState().queueInfo
  var currTrack = queueCurrStore.QueueInfo.currentTrack
  AudioPlayerStore.dispatch(storeAudioPlayerInfo({
    playing: playing,
    subreddit: "r/LoremIpsum",
    filename: currTrack.filename,
    trackName: currTrack.track_name,
    audio: new Audio(currTrack.cloud_storage_url),
    url: currTrack.cloud_storage_url,
  }))

}

module.exports = {
  syncDB,
  getQueue,
  syncQueueWithAudioPlayer,
  forceSyncQueueWithAudioPlayer
}