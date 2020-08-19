import { useState, useEffect } from "react";

import { storeAudioPlayerInfo, togglePlaying } from "../../../redux/actions/index"
import { AudioPlayerStore } from "../../../redux/store"


const nextTrack = () => {
  const currStore = AudioPlayerStore.getState()
  var keyIndex = currStore["keyIndex"]
  var playlist = currStore["playlist"]



  if (keyIndex < playlist["keys"].length - 1) {
    var filename = currStore["playlist"]["keys"][keyIndex + 1]
    var podcast = currStore["playlist"][filename]

    var track = new Audio(podcast["cloud_storage_url"])
    track.setAttribute("id", "audio")
    currStore["audio"].setAttribute("id", "")
    AudioPlayerStore.dispatch(togglePlaying(false))


    AudioPlayerStore.dispatch(storeAudioPlayerInfo({
      playing: true,
      subreddit: currStore["subreddit"],
      trackName: filename,
      audio: track,
      url: podcast["cloud_storage_url"],
      playlist: playlist,
      keyIndex: playlist["keys"].indexOf(filename)
    }))
  }



}

function useAudioPlayer(audioObject, trackPlaying) {
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(trackPlaying);
  const [clickedTime, setClickedTime] = useState();
  const [curSource, setCurSource] = useState();
  const [source, setSource] = useState();
  const [audio, setAudio] = useState(audioObject);
  // console.log("audio in useaudioplayer 1", audio)

  // var audioElement = {}
  // var elementId = "audioElement" + new Date().valueOf().toString();
  // var audioElement = document.createElement('audio');
  // audioElement.setAttribute("id", elementId);
  // document.body.appendChild(audioElement);
  // setAudio(audioElement)

  // if (audio === undefined) {
  //   return {
  //     curTime,
  //     duration,
  //     playing,
  //     setPlaying,
  //     setClickedTime,
  //     setSource,
  //     curSource,
  //     source
  //   }
  // }

  if (curTime && duration && curTime === duration) {
    // setPlaying(false);
    setCurTime(0);
    nextTrack()
    // audio.currentTime = 0;
  }

  useEffect(() => {

    // const audio = document.getElementById("audio");
    // <audio id="audio" src="https://storage.cloud.google.com/listen-to-reddit-test/subreddits/jokes/jokes-2020-06-03.mp3">Your browser does not support the <code>audio</code> element.</audio>
    //<audio preload="auto" src="https://storage.cloud.google.com/listen-to-reddit-test/subreddits/jokes/jokes-2020-06-03.mp3" id="audio"></audio>
    // console.log("audio in useaudioplayer 2", audio)
    // const audio = audioElement
    setAudio(audio)
    // state setters wrappers
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurTime(audio.currentTime);
      setCurSource(audio.source)
    }

    const setAudioTime = () => setCurTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);

    audio.addEventListener("timeupdate", setAudioTime);

    if (clickedTime && clickedTime !== curTime) {
      console.log("curTime:", curTime)
      audio.currentTime = clickedTime;
      setClickedTime(null);
    }

    if (curSource !== source) {
      setPlaying(false)
      setCurSource(source)
      audio.currentTime = 0;
    }

    // effect cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    }
  });

  return {
    curTime,
    duration,
    playing,
    setPlaying,
    setClickedTime,
    setSource,
    curSource,
    source
  }
}

export default useAudioPlayer;