import { useState, useEffect } from "react";



function useAudioPlayer(audioObject, trackPlaying) {
  // console.log("audioObject", audioObject)
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(trackPlaying);
  const [clickedTime, setClickedTime] = useState(-1);
  const [currentlyScrubbing, setCurrentlyScrubbing] = useState(false)
  const [syncBarTimeWithAudio, setSyncBarTimeWithAudio] = useState(false)
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


    const setAudioTime = !currentlyScrubbing? () => setCurTime(audio.currentTime) : () => {};

    audio.addEventListener("loadeddata", setAudioData);

    audio.addEventListener("timeupdate", setAudioTime);

    // console.log("clickedTime", clickedTime)
    if (clickedTime >= 0 && clickedTime !== curTime ) {
      console.log("clickedTime:", clickedTime)
      console.log("syncBarTimeWithAudio", syncBarTimeWithAudio  )
      // window.addEventListener("mouseup", () => {setSyncBarTimeWithAudio(true)})
      setCurTime(clickedTime)
      if(syncBarTimeWithAudio){
        audio.currentTime = clickedTime;
        setSyncBarTimeWithAudio(false)
        setClickedTime(-1);
      }
    }

    if (curSource !== source) {
      console.log("curSource !== source", curSource !== source)
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
    setSyncBarTimeWithAudio,
    setCurrentlyScrubbing,
    currentlyScrubbing,
    curSource,
    source
  }
}

export default useAudioPlayer;