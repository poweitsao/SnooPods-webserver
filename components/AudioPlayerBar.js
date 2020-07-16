import React from 'react';
import { Navbar } from "react-bootstrap"
// import Audio from "./custom-audio-player/src/Audio"

import Track from "./custom-audio-player/src/Track";
import Play from "./custom-audio-player/src/Play";
import Pause from "./custom-audio-player/src/Pause";
import Bar from "./custom-audio-player/src/Bar";
import { useState, useEffect } from "react"
import useAudioPlayer from './custom-audio-player/src/useAudioPlayer';

class AudioPlayerBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { src: "", subreddit: "", podcast: "", audio: "" }
        this.audioRef = React.createRef();
        this.playAudio = this.playAudio.bind(this);
    }

    playAudio() {
        this.audioRef.current.play();
    }

    async componentDidUpdate(prevState) {
        if (prevState.subreddit !== this.props.subreddit || prevState.podcast !== this.props.podcast || prevState.src !== this.props.src || prevState.audio !== this.props.audio) {
            this.setState((state) => {
                return { currSrc: state.currSrc, src: this.props.src, subreddit: this.props.subreddit, podcast: this.props.podcast, audio: this.props.audio }
            })
        }
    }

    render() {
        return (

            <div>
                {/* <audio ref={this.audioRef}></audio> */}
                <Navbar bg="light" fixed="bottom" >
                    {this.state.audio
                        ? <AudioPlayer src={this.state.src} trackName={this.state.podcast} subreddit={this.state.subreddit} audio={this.state.audio} />
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
                : <AudioPlayerInfo src={props.src} trackName={props.trackName} subreddit={props.subreddit} audio={props.audio} />
            }
        </div>
    )
}

function AudioPlayerInfo(props) {
    const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer(props.audio);
    const source = props.src;
    const subreddit = props.subreddit;
    const trackName = props.trackName;
    const audio = props.audio;
    // console.log("props.audio in AudioPlayerBar", props.audio)

    if (audio !== null && playing && duration) {
        // props.playAudio();
        console.log("playing in audioplayerbar")
        console.log(duration)

        // audio.play()
    }

    return (
        <div>
            <div className="player" style={{ width: "100%" }}>
                {/* {console.log("audio in audioplayerbar", audio)} */}

                {/* <audio id="audio" >
                    <source src={source} />
                    Your browser does not support the <code>audio</code> element.
                </audio> */}
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

export default AudioPlayerBar