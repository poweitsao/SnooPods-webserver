import React from "react";
import Track from "./Track";
import Play from "./Play";
import Pause from "./Pause";
import Bar from "./Bar";
import { useState, useEffect } from "react"
import useAudioPlayer from './useAudioPlayer';



function AudioPlayer(props) {
  const { curTime, duration, playing, setPlaying, setClickedTime, audio } = useAudioPlayer();
  const source = props.src;
  const subreddit = props.subreddit;
  const trackName = props.trackName;
  return (
    <div>
      <div className="player" style={{ width: "100%" }}>
        <audio id="audio">
          <source src={source} />
        Your browser does not support the <code>audio</code> element.
      </audio>
        <div className="track-info">
          <Track trackName={trackName} subreddit={subreddit} />
        </div>
        <div className="controls">
          {playing ?
            <Pause handleClick={() => {
              setPlaying(false);
              audio.pause();
            }} /> :
            <Play handleClick={() => {
              setPlaying(true);
              audio.play();
            }} />
          }
        </div>
        <div className="track-duration-info">
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
        .track-info{
          margin-left:auto;
          padding-right: 20px;
        }
        .track-duration-info{
          margin-right: 10%;
          width: 30%;
        }
        .controls {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10%;
          margin-left: 20%;
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

      {/* <AudioPlayer src={props.src} trackName={props.trackName} subreddit={props.subreddit} /> */}

      {reload
        ? <div></div>
        : <AudioPlayer src={props.src} trackName={props.trackName} subreddit={props.subreddit} />
      }
    </div>
  )
}

export default Audio;
