import React from "react";
import Song from "./Song";
import Play from "./Play";
import Pause from "./Pause";
import Bar from "./Bar";

import useAudioPlayer from './useAudioPlayer';

function Audio() {
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer();

  return (
    <div>
      <div className="player">
        <audio id="audio">
          <source src="https://storage.cloud.google.com/listen-to-reddit-test/podcasts/indianVoice.mp3" />
        Your browser does not support the <code>audio</code> element.
      </audio>
        <div className="song-info">
          <Song songName="Instant Crush" songArtist="Daft Punk ft. Julian Casablancas" />
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
      <style>
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

export default Audio;
