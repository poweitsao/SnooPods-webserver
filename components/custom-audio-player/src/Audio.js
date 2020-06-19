import React from "react";
import Song from "./Song";
import Play from "./Play";
import Pause from "./Pause";
import Bar from "./Bar";
import { useState, useEffect } from "react"
import useAudioPlayer from './useAudioPlayer';


function AudioPlayer(props) {
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer();
  const source = props.src
  return (
    <div>
      <div className="player">
        <audio id="audio">
          <source src={source} />
        Your browser does not support the <code>audio</code> element.
      </audio>
        <div className="song-info">
          <Song songName={source} songArtist="Daft Punk ft. Julian Casablancas" />
        </div>
        <div className="controls">
          {playing ?
            <Pause handleClick={() => setPlaying(false)} /> :
            <Play handleClick={() => setPlaying(true)} />
          }
        </div>
        <div className="song-duration-info">
          <Bar curTime={curTime} duration={duration} onTimeUpdate={(time) => setClickedTime(time)} />
        </div>
      </div>
      <style >
        {`.player {
          display:flex;
          justify-content:center;
          align-items:center;
          padding: 20px 0;
          background-color: #EAECEF;
        }
        .song-info{
          margin-left:auto;
          padding-right: 20px;
        }
        .song-duration-info{
          margin-right: auto;
        }
        .controls {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: auto;
          margin-left: auto;
        }`}
      </style>


    </div>
  );
}


function Audio(props) {
  const [source, setSource] = useState("")
  const [reload, setReload] = useState(false)
  useEffect(() => {
    if (props.src !== source) {
      setSource(props.src)
      setReload(true)
    }
    if (props.src === source && reload) {
      setReload(false)
    }
  })

  return (
    <div>
      {reload
        ? <div></div>
        : <AudioPlayer src={props.src} />
      }
    </div>
  )
}

export default Audio;
