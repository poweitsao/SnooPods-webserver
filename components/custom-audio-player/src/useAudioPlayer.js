import { useState, useEffect } from "react";



function useAudioPlayer(audioObject, trackPlaying) {
  // console.log("audioObject", audioObject)
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(trackPlaying);
  const [clickedTime, setClickedTime] = useState(-1);
  const [curSource, setCurSource] = useState();
  const [source, setSource] = useState();
  const [audio, setAudio] = useState(audioObject);


  useEffect(() => {

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