import React from 'react';
import { Navbar } from "react-bootstrap"

import Track from "./custom-audio-player/src/Track";
import Play from "./custom-audio-player/src/Play";
import Pause from "./custom-audio-player/src/Pause";
import Bar from "./custom-audio-player/src/Bar";
import { useState, useEffect } from "react"
import useAudioPlayer from './custom-audio-player/src/useAudioPlayer';
import { AudioPlayerStore } from "../redux/store"




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
                        : <div style={{ paddingTop: "84px" }}></div>
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
                ? <div></div>
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

function AudioPlayerInfo(props) {
    const { curTime, duration, setClickedTime } = useAudioPlayer(props.audio);
    const source = props.url;
    const subreddit = props.subreddit;
    const trackName = props.trackName;
    const audio = props.audio;

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
                <div className="controls">
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

export default AudioPlayerBar