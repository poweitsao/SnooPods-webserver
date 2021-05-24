import React from 'react';
import { Navbar } from "react-bootstrap"

import Track from "./custom-audio-player/src/Track";
import Play from "./custom-audio-player/src/Play";
import Pause from "./custom-audio-player/src/Pause";
import Replay10 from "./custom-audio-player/src/Replay10"
import Forward10 from "./custom-audio-player/src/Forward10"
import Bar from "./custom-audio-player/src/Bar";
import { useState, useEffect } from "react"
import useAudioPlayer from './custom-audio-player/src/useAudioPlayer';
import { AudioPlayerStore } from "../redux/store"
import { storeAudioPlayerInfo, togglePlaying } from "../redux/actions/index"

import { QueueStore } from "../redux/store";
import { storeQueueInfo, getQueueInfo, pushNextTrack, replaceCurrentTrack, addPlaylistToQueue, clearCurrentPlaylist, removeTrackFromCurrentPlaylist, removePlaylistFromQueue, removeTrackFromQueue } from "../redux/actions/queueActions";
import isEmpty from '../lib/isEmptyObject';
import syncDB from "../lib/syncQueue";





class AudioPlayerBar extends React.Component {
    constructor(props) {
        super(props)

    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(" the props in audio bar", this.props)
        if (prevProps.audio !== this.props.audio) {
            // console.log("audio changed")
        }
    }

    render() {
        return (
            <div>
                <Navbar bg="light" fixed="bottom" >
                    {this.props.audio
                        ? <AudioPlayer url={this.props.url}
                            trackName={this.props.trackName}
                            subreddit={this.props.subreddit}
                            audio={this.props.audio}
                            playing={this.props.playing}
                            changeAudioPlayerInfo={this.props.changeAudioPlayerInfo}
                            togglePlaying={this.props.togglePlaying} />

                        : <AudioPlayer url={""}
                        trackName={""}
                        subreddit={""}
                        audio={null}
                        playing={""}
                        changeAudioPlayerInfo={""}
                        togglePlaying={""} />
                    }
                </Navbar>
            </div>
        )
    }
}

function AudioPlayer(props) {
    const [source, setSource] = useState("")
    const [reload, setReload] = useState(false)
    const [audio, setAudio] = useState(undefined)
    useEffect(() => {

        
        if (props.audio !== audio) {
            if (audio !== null && audio !== undefined) {
                // console.log("Pausing before switching!")
                audio.pause()
            }
            setSource(props.url)
            setAudio(props.audio)
            setReload(true)
        }
        else if (props.url === source && reload) {
            setReload(false)
        }
    })
    console.log(props)
    return (
        <div>
            {reload
                ? <div style={{ width: "100%", height: "100%" }}></div>
                : (props.url == ""
                    ? <EmptyAudioPlayerInfo/>
                    : <AudioPlayerInfo
                        url={props.url}
                        trackName={props.trackName}
                        subreddit={props.subreddit}
                        audio={props.audio}
                        playing={props.playing}
                        changeAudioPlayerInfo={props.changeAudioPlayerInfo}
                        togglePlaying={props.togglePlaying} />
                )
            }
        </div>
    )
}

const nextTrack = () => {
    const currStore = AudioPlayerStore.getState()
    var keyIndex = currStore["keyIndex"]
    var playlist = currStore["playlist"]

    if (keyIndex < playlist["keys"].length - 1) {
        var filename = currStore["playlist"]["keys"][keyIndex + 1]
        var podcast = currStore["playlist"]["tracks"][filename]

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
    } else{
        AudioPlayerStore.dispatch(togglePlaying(false))
    }
}

const nextTrackFromQueue = () => {
    // var keyIndex = currStore["keyIndex"]
    // var playlist = currStore["playlist"]
    const audioCurrStore = AudioPlayerStore.getState()
    console.log("pushing next track")
    QueueStore.dispatch(pushNextTrack())
    syncDB(audioCurrStore.email)
        
    var queueCurrStore = QueueStore.getState()
    var currTrack = queueCurrStore.QueueInfo.currentTrack
    console.log("queueCurrStore from nextTrackFromQueue", queueCurrStore)

    console.log("currTrack from nextTrackFromQueue", currTrack)
    if (!isEmpty(currTrack)) { 
        // var filename = currStore["playlist"]["keys"][keyIndex + 1]
        // var podcast = currStore["playlist"]["tracks"][filename]

        var track = new Audio(currTrack.cloud_storage_url)
        track.setAttribute("id", "audio")
        audioCurrStore["audio"].setAttribute("id", "")
        AudioPlayerStore.dispatch(togglePlaying(false))

        AudioPlayerStore.dispatch(storeAudioPlayerInfo({
            playing: true,
            subreddit: "r/LoremIpsum",
            trackName: currTrack.track_name,
            audio: track,
            url: currTrack.cloud_storage_url,
        }))
    } else{
        AudioPlayerStore.dispatch(togglePlaying(false))
    }
}

function AudioPlayerInfo(props) {
    const { curTime, duration, setClickedTime, setCurTime } = useAudioPlayer(props.audio);
    const source = props.url;
    const subreddit = props.subreddit;
    const trackName = props.trackName;
    const audio = props.audio;

    useEffect(() => {

        if (curTime && duration && curTime === duration) {
            // setPlaying(false);
            // audio.pause();
            console.log("next")
            setCurTime(0);
            console.log("props", props)
            nextTrackFromQueue()
            // testQueueStore()
            // audio.currentTime = 0;
        }
    })

    if (audio !== null && props.playing && duration) {
        // audio.play()

        var playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            if (curTime == duration){
                audio.pause()
            }
          })
          .catch(error => {
          });
        }

    } if (audio !== null){
        if (props.playing && audio.paused) {
            audio.play()
        } else if (!props.playing && !audio.paused) {
            
            audio.pause()
        }
    }
 
    const testQueueStore = () =>{
        let queueCurrStore = QueueStore.getState()
        console.log("queueCurrStore", queueCurrStore)
    }

    return (
        <div>
            <div className="player" style={{ width: "100%" }}>
                <div className="track-info">
                    <Track trackName={trackName} subreddit={"r/"+subreddit} />
                </div>
                <div className="center-piece">
                    <div className="controls">
                        <Replay10 handleClick={() => {
                            setClickedTime(Math.max(curTime - 10, 0))
                        }} />

                        {props.playing ?
                            <Pause handleClick={() => {
                                props.togglePlaying(false)
                                console.log("pausing...")
                                audio.pause();
                            }} /> :
                            <Play handleClick={() => {
                                props.togglePlaying(true)
                                audio.play();
                            }} />
                        }
                        <Forward10 handleClick={() => {
                            if (curTime + 10 > duration) {
                                console.log("duration:", duration)
                                setClickedTime(duration)
                            } else {
                                setClickedTime(curTime + 10)
                            }
                        }} />
                        {/* <button onClick={testQueueStore}>test</button> */}


                    </div>
                    <div className="track-duration-info">
                        <Bar curTime={curTime} duration={props.audio.duration} onTimeUpdate={(time) => setClickedTime(time)} />
                    </div>
                </div>
                <div className="volume">
                    <p>Volume</p>
                </div>
            </div>
            <style >
                {`
         .player {
            display:flex;
            justify-content: space-between;
            align-items:center;
            padding-top: 10px;
            padding-bottom:10px;
            background-color: #EAECEF;
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
          }
          .controls {
            display: flex; 
          }`}
            </style>
        </div>
    );
}

function EmptyAudioPlayerInfo(props) {
    // const { curTime, duration, setClickedTime, setCurTime } = useAudioPlayer(props.audio);
    const source = props.url;
    const subreddit = props.subreddit;
    const trackName = props.trackName;
    const audio = props.audio;

    return (
        <div>
            <div className="player" style={{ width: "100%" }}>
                <div className="track-info">
                    <Track trackName={""} subreddit={""} />
                </div>
                <div className="center-piece">
                    <div className="controls">
                        <Replay10 handleClick={() => {}} />
                        <Play handleClick={() => {}} />
                        <Forward10 handleClick={() => {}} />
                    </div>
                    <div className="track-duration-info">
                        {/* <Bar curTime={0} duration={0} onTimeUpdate={() =>{}} /> */}
                    </div>
                </div>
                <div className="volume">
                    <p>Volume</p>
                </div>
            </div>
            <style >
                {`
         .player {
            display:flex;
            justify-content: space-between;
            align-items:center;
            padding-top: 10px;
            padding-bottom:10px;
            background-color: #EAECEF;
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
          }
          .controls {
            display: flex; 
          }`}
            </style>
        </div>
    );
}

// AudioPlayerBar.getInitialProps = async ({ req }) => {
//     // console.log("req", req)
//     const cookies = parseCookies(req)
  
//     // const res = await fetch(server + "/api/podcasts/getFeatured", { method: "GET" })
//     //   if (res.status === 200) {
  
//     //     var featured = await res.json()
//     //     console.log("featured in home: ", featured)
//     //     // setFeaturedSubreddits(featured);
//     //   } else{
//     //     var featured = {} 
//     //   }
  
//     return {
//       userSession: {
//         "session_id": cookies.session_id,
//         "email": cookies.email
//       }
//       // featured: data,
//       // revalidate: 60 //seconds
//     };
//   }
  

export default AudioPlayerBar