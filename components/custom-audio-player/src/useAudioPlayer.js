import { useState, useEffect } from "react";

import { storeAudioPlayerInfo, togglePlaying } from "../../../redux/actions/index"
import { AudioPlayerStore } from "../../../redux/store"




function useAudioPlayer(audioObject, trackPlaying) {
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(trackPlaying);
  const [clickedTime, setClickedTime] = useState(-1);
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

  // if (curTime && duration && curTime === duration) {
  //   // setPlaying(false);
  //   setCurTime(0);
  //   nextTrack()
  //   // audio.currentTime = 0;
  // }

  useEffect(() => {

    // const audio = document.getElementById("audio");
    // <audio id="audio" src="https://storage.cloud.google.com/snoopods-us/subreddits/jokes/jokes-2020-06-03.mp3">Your browser does not support the <code>audio</code> element.</audio>
    //<audio preload="auto" src="https://storage.cloud.google.com/snoopods-us/subreddits/jokes/jokes-2020-06-03.mp3" id="audio"></audio>
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

    // console.log("clickedTime", clickedTime)
    if (clickedTime >= 0 && clickedTime !== curTime) {
      console.log("curTime:", curTime)
      audio.currentTime = clickedTime;
      setClickedTime(-1);
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
    setCurTime,
    curSource,
    source
  }
}

export default useAudioPlayer;