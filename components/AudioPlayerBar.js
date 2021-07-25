import React from "react";
import { Navbar } from "react-bootstrap";

import Track from "./custom-audio-player/src/Track";
import Play from "./custom-audio-player/src/Play";
import Pause from "./custom-audio-player/src/Pause";
import Replay10 from "./custom-audio-player/src/Replay10";
import Next from "./custom-audio-player/src/Next";
import Previous from "./custom-audio-player/src/Previous";

import Forward10 from "./custom-audio-player/src/Forward10";
import Bar from "./custom-audio-player/src/Bar";
import { useState, useEffect } from "react";
import useAudioPlayer from "./custom-audio-player/src/useAudioPlayer";
import store from "../redux/store";
import { togglePlaying } from "../redux/actions/index";

import {
  storeQueueInfo,
  getQueueInfo,
  pushNextTrack,
  replaceCurrentTrack,
  addPlaylistToQueue,
  clearCurrentPlaylist,
  removeTrackFromCurrentPlaylist,
  removePlaylistFromQueue,
  removeTrackFromQueue,
} from "../redux/actions/queueActions";
import isEmpty from "../lib/isEmptyObject";
import {
  syncDB,
  syncQueueWithAudioPlayer,
  forceSyncQueueWithAudioPlayer,
} from "../lib/syncQueue";
import { addToHistory, removeLastTrack } from "../redux/actions/historyActions";
import { syncHistory } from "../lib/syncHistory";
import fetch from "isomorphic-unfetch";

import VolumeSlider from "../components/VolumeSlider";
import useSWR, { trigger } from "swr";
import { storeVolume } from "../redux/actions/volumeActions";
import { Provider } from "react-redux";
import { getQueue } from "../lib/syncQueue";

class AudioPlayerBar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(" the props in audio bar", this.props)
    // if (prevProps.audio !== this.props.audio) {
    //     // console.log("audio changed")
    // }

    //! sync with db when playing!
    syncDB();
    // console.log(this.props)
  }

  render() {
    return (
      <div>
        <Navbar
          bg="light"
          fixed="bottom"
          style={{
            width: "100%",
            height: "min(9.5%, 120px)",
            padding: "unset",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {this.props.audioPlayerInfo.audio ? (
            <AudioPlayer
              url={this.props.audioPlayerInfo.url}
              trackName={this.props.audioPlayerInfo.trackName}
              subreddit={this.props.audioPlayerInfo.subreddit}
              audio={this.props.audioPlayerInfo.audio}
              playing={this.props.audioPlayerInfo.playing}
              pictureURL={this.props.audioPlayerInfo.picture_url}
              changeAudioPlayerInfo={
                this.props.audioPlayerInfo.changeAudioPlayerInfo
              }
              togglePlaying={this.props.togglePlaying}
              email={this.props.userSessionInfo.email}
            />
          ) : (
            <AudioPlayer
              url={""}
              trackName={""}
              subreddit={""}
              audio={null}
              playing={""}
              pictureURL={""}
              changeAudioPlayerInfo={""}
              togglePlaying={""}
              email={this.props.userSessionInfo.email}
            />
          )}
        </Navbar>
      </div>
    );
  }
}

function AudioPlayer(props) {
  const [source, setSource] = useState("");
  const [reload, setReload] = useState(false);
  const [audio, setAudio] = useState(undefined);

  // console.log("audiopalyer email", props.email)

  // console.log("userSWR volume", volume)

  useEffect(() => {
    if (props.audio !== audio) {
      if (audio !== null && audio !== undefined) {
        // console.log("Pausing before switching!")
        audio.pause();
      }
      setSource(props.url);
      setAudio(props.audio);
      setReload(true);
    } else if (props.url === source && reload) {
      setReload(false);
    }
  });
  // console.log(props)
  return (
    <div style={{ height: "100%" }}>
      {reload ? (
        <div style={{ width: "100%", height: "100%" }}></div>
      ) : props.url == "" ? (
        <EmptyAudioPlayerInfo />
      ) : (
        <AudioPlayerInfo
          url={props.url}
          trackName={props.trackName}
          subreddit={props.subreddit}
          audio={props.audio}
          playing={props.playing}
          pictureURL={props.pictureURL}
          changeAudioPlayerInfo={props.changeAudioPlayerInfo}
          togglePlaying={props.togglePlaying}
        />
      )}
    </div>
  );
}

const nextTrackFromQueue = async () => {

  store.dispatch(togglePlaying(false));

  let audioCurrStore = store.getState().audioPlayerInfo;

  await getQueue(store.getState().userSessionInfo.email);
  store.dispatch(pushNextTrack());

  syncDB();
  store.dispatch(
    addToHistory(store.getState().queueInfo.QueueInfo.currentTrack)
  );
  syncHistory();

  var queueCurrStore = store.getState().queueInfo;
  var currTrack = queueCurrStore.QueueInfo.currentTrack;

  store.dispatch(togglePlaying(false));
  forceSyncQueueWithAudioPlayer(true);
  // setWaitingForNextTrack(false);
};

function AudioPlayerInfo(props) {
  const { curTime, setClickedTime, setSyncBarTimeWithAudio, setCurrentlyScrubbing, currentlyScrubbing } = useAudioPlayer(props.audio);
  const source = props.url;
  const subreddit = props.subreddit;
  const trackName = props.trackName;
  const audio = props.audio;
  const pictureURL = props.pictureURL;
  const duration = store.getState().audioPlayerInfo.audio.duration;
  const [waitingForNextTrack, setWaitingForNextTrack] = useState(false)

  const [volume, setVolume] = useState(1);
  audio.onended = () => {
    console.log("next");
    audio.pause();
    // setWaitingForNextTrack(true)
    nextTrackFromQueue();
  }
  // useEffect(() => {
  //   // console.log(audio.currentTime, audio.duration)
  //   // if(audio.currentTime == duration){
  //   //   console.log("audio.currentTime == duration", audio.currentTime == duration)
  //   // }
  //   if (audio.currentTime && duration && audio.currentTime === duration && !waitingForNextTrack) {

  //   }
  // });

  if (audio !== null && props.playing && duration) {

    var playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          if (audio.currentTime == duration) {
            audio.pause();
          }
        })
        .catch((error) => {});
    }
  }
  if (audio !== null) {
    if (props.playing && audio.paused) {
      audio.play();
    } else if (!props.playing && !audio.paused) {
      audio.pause();
    }
  }

  const testQueueStore = () => {
    let queueCurrStore = store.getState();
    console.log("currStore", queueCurrStore);
  };

  const previousTrack = async () => {
    let history = store.getState().historyInfo.History;

    if (history.length == 0) {
      // Set cur time to 0
      setClickedTime(0);
    } else {
      var prevTrack = history[history.length - 1];
      store.dispatch(removeLastTrack());
      console.log("prevTrack", prevTrack);

      store.dispatch(replaceCurrentTrack(prevTrack));
      syncDB();
      syncQueueWithAudioPlayer(true);
      syncHistory();

      store.dispatch(togglePlaying(false));
      forceSyncQueueWithAudioPlayer(true);
    }
  };

  return (
    <div
      className="player"
      style={{ width: "100%", height: "100%", backgroundColor: "#1d2460" }}
    > 
      <div className="player-info-container">
        <div className="track-info">
          <Track
            pictureURL={pictureURL}
            trackName={trackName}
            subreddit={"r/" + subreddit}
          />
        </div>
        <div className="center-piece">
          <div className="controls">
            <Previous handleClick={previousTrack} />
            {props.playing ? (
              <Pause
                handleClick={() => {
                  props.togglePlaying(false);
                  console.log("pausing...");
                  audio.pause();
                }}
                width="min(4vh, 51px)" 
                height="min(4vh, 51px)"
                backgroundImage="linear-gradient(to bottom, #2156d9, #4630a0)"
                playIconWidth="24"
                playIconColor="white"
              />
            ) : (
              <Play
                handleClick={() => {
                  props.togglePlaying(true);
                  audio.play();
                }}
                width="min(4vh, 51px)" 
                height="min(4vh, 51px)"
                backgroundImage="linear-gradient(to bottom, #2156d9, #4630a0)"
                playIconWidth="24"
                playIconColor="white"
              />
            )}

            <Next handleClick={nextTrackFromQueue} />

          </div>
          <div className="track-duration-info">
            <Bar
              curTime={curTime}
              duration={props.audio.duration}
              onTimeUpdate={(time) => setClickedTime(time)}
              setSyncBarTimeWithAudio={setSyncBarTimeWithAudio}
              setCurrentlyScrubbing={setCurrentlyScrubbing}
              currentlyScrubbing={currentlyScrubbing}
            />
          </div>
        </div>
        <div className="volume">
          {volume !== undefined ? (
            <Provider store={store}>
              <VolumeSlider />
            </Provider>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <style>
        {`
         .player {
            display: flex;
            justify-content: center;
            align-content: center;
            background-color: #1d2460;
          }
          .player-info-container{
            display:flex;
            justify-content: space-between;
            align-items:center;
            width: min(96.25vw, 1848px)
          }
          .center-piece{
              display:flex;
              flex-direction: column;
              justify-content:space-between;
              align-items:center;
              width:70%;
          } 
          .track-info{
            width:35%;
            margin-left:5%;
            font-size: 25;
          }
          .volume{
            display:flex;
            justify-content: flex-end;
            width:25%;
            margin-right:5%;
            font-size: 25;
          }
          .track-duration-info{
            width: 100%;
            margin-top: min(0.63vh, 8px)
          }
          .controls {
            display: flex; 
            align-items: center;
          }`}
      </style>
    </div>
  );
}

function EmptyAudioPlayerInfo(props) {
  return (
    <div style={{ height: "100%" }}>
      <div className="player" style={{ width: "100%", height: "100%" }}>
        <div className="track-info">
          <Track trackName={""} subreddit={""} />
        </div>
        <div className="center-piece">
          <div className="controls">
            <Play
              handleClick={() => {}}
              width="min(4vh, 51px)"
              height="min(4vh, 51px)"
              backgroundImage="linear-gradient(to bottom, #2156d9, #4630a0)"
              playIconWidth="24"
              playIconColor="white"
            />
          </div>
          <div className="track-duration-info">
            <Bar curTime={0} duration={0} onTimeUpdate={() => {}} />
          </div>
        </div>
        <div className="volume">
          <div style={{ width: "200px" }}></div>
        </div>
      </div>
      <style>
        {`
         .player {
            display:flex;
            justify-content: space-between;
            align-items:center;
            padding-top: 10px;
            padding-bottom:10px;
            background-color: #1d2460;
          }
          .center-piece{
              display:flex;
              flex-direction: column;
              justify-content:space-between;
              align-items:center;
              width:70%;
          } 
          .track-info{
            width:35%;
            margin-left:5%;
            font-size: 25;
          }
          .volume{
            display:flex;
            justify-content: flex-end;
            width:35%;
            margin-right:5%;
            font-size: 25;
          }
          .track-duration-info{
            width: 100%;
            margin-top: min(0.63vh, 8px)
          }
          .controls {
            display: flex; 
          }`}
      </style>
    </div>
  );
}

export default AudioPlayerBar;
