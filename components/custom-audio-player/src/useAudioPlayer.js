import { useState, useEffect } from "react";
function useAudioPlayer(audioObject) {
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(true);
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


  if (curTime && duration && curTime === duration) {
    setPlaying(false);
    setCurTime(0);
    audio.currentTime = 0;
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
    source,
    audio
  }
}

export default useAudioPlayer;