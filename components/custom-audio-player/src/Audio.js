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
        <Song songName="Instant Crush" songArtist="Daft Punk ft. Julian Casablancas" />
        <div className="controls">
          {playing ?
            <Pause handleClick={() => setPlaying(false)} /> :
            <Play handleClick={() => setPlaying(true)} />
          }
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
          outline:solid 2px black;

  .controls {
    width: 200px;
    margin: 0 20px;
    display: flex;

    justify-content: center;
    align-items: center;
  }

    svg {
      font-size: 4em;
      color: black;
    }
  }
  .controls {
    width: 500px;
    margin: 0 20px;
    display: flex;

    justify-content: space-around;
    align-items: center;
  }

  

  @media screen and (max-width: 800px) {
    flex-direction: column;

    .controls {
      width: 100%;
      margin-top: 20px;
    }

    .bar {
      width: 90%;
    }
  }

  @media screen and (max-width: 500px) {
    .song {
      .song__title {
        font-size: 2.5em;
      }

      .song__artist {
        font-size: 0.8em;
      }
    }
  }
}
`}
      </style>


    </div>
  );
}

export default Audio;
