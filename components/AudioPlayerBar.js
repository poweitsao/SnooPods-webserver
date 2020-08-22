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

                        : <div style={{ paddingTop: "84px", width: "100%", height: "100%" }}></div>
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
            if (audio !== undefined) {
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

    return (
        <div>
            {reload
                ? <div style={{ width: "100%", height: "100%" }}></div>
                : <AudioPlayerInfo
                    url={props.url}
                    trackName={props.trackName}
                    subreddit={props.subreddit}
                    audio={props.audio}
                    playing={props.playing}
                    changeAudioPlayerInfo={props.changeAudioPlayerInfo}
                    togglePlaying={props.togglePlaying} />
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
        var podcast = currStore["playlist"][filename]

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
            setCurTime(0);
            nextTrack()
            // audio.currentTime = 0;
        }
    })

    if (audio !== null && props.playing && duration) {
        audio.play()
    }
    if (props.playing && audio.paused) {
        audio.play()
    } else if (!props.playing && !audio.paused) {
        audio.pause()
    }

    return (
        <div>
            <div className="player" style={{ width: "100%" }}>
                <div className="track-info">
                    <Track trackName={trackName} subreddit={subreddit} />
                </div>
                <div className="center-piece">
                    <div className="controls">
                        <Replay10 handleClick={() => {
                            if (curTime - 10 > 0) {
                                setClickedTime(curTime - 10)
                            } else {
                                setClickedTime(duration)
                            }
                        }} />

                        {props.playing ?
                            <Pause handleClick={() => {
                                props.togglePlaying(false)
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

export default AudioPlayerBar