import React from 'react';
import { Navbar } from "react-bootstrap"
// import Audio from "./custom-audio-player/src/Audio"

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

        // this.state = { src: "", subreddit: "", podcast: "", audio: "" }
    }

    componentDidUpdate(prevProps, prevState) {
        // if (prevProps.subreddit !== this.props.subreddit || prevProps.podcast !== this.props.podcast || prevProps.src !== this.props.src || prevProps.audio !== this.props.audio) {
        console.log(" the props in audio bar", this.props)
        // console.log("prevProps", prevProps)
        // console.log("this.props:", this.props)
        if (prevProps.audio !== this.props.audio) {
            console.log("audio changed")
            //     this.setState((state) => {
            //         return { reload: true }
            //     })
            // } else if (this.state.reload) {
            //     this.setState((state) => {
            //         return { reload: false }
            //     })
        }
    }

    render() {
        return (

            <div>
                {/* <audio ref={this.audioRef}></audio> */}
                {/* {console.log(this.props)} */}
                <Navbar bg="light" fixed="bottom" >
                    {this.props.audio
                        ? <AudioPlayer url={this.props.url}
                            trackName={this.props.trackName}
                            subreddit={this.props.subreddit}
                            audio={this.props.audio}
                            playing={this.props.playing}
                            changeAudioPlayerInfo={this.props.changeAudioPlayerInfo}
                            togglePlaying={this.props.togglePlaying} />
                        // ? <AudioPlayerInfo src={this.props.src} trackName={this.props.trackName} subreddit={this.props.subreddit} audio={this.props.audio} />
                        : <div style={{ paddingTop: "84px" }}>audio bar</div>
                    }
                </Navbar>
            </div>
        )
    }
}

// function AudioPlayerBar({ AudioPlayerInfo, dispatch }) {
//     console.log("audio player info:", AudioPlayerInfo)

//     return (

//         <div>
//             {/* <audio ref={this.audioRef}></audio> */}
//             {console.log("AudioPlayerInfo:", AudioPlayerInfo)}
//             <Navbar bg="light" fixed="bottom" >
//                 {AudioPlayerInfo.audio
//                     // ? <AudioPlayer url={AudioPlayerInfo.url} trackName={AudioPlayerInfo.trackName} subreddit={AudioPlayerInfo.subreddit} audio={AudioPlayerInfo.audio} playing={AudioPlayerInfo.playing} dispatch={dispatch} />
//                     ? <AudioPlayer audioPlayerInfo={AudioPlayerInfo} dispatch={dispatch} />

//                     // ? <AudioPlayerInfo src={this.props.src} trackName={this.props.trackName} subreddit={this.props.subreddit} audio={this.props.audio} />
//                     : <div style={{ paddingTop: "84px" }}></div>
//                 }
//             </Navbar>
//         </div>
//     )
// }

function AudioPlayer(props) {
    const [source, setSource] = useState("")
    const [reload, setReload] = useState(false)
    const [audio, setAudio] = useState(undefined)
    // const [audio, setAudio] = useState()
    useEffect(() => {
        if (props.audio !== audio) {
            // console.log("AudioPlayer props:", props)
            if (audio !== undefined) {
                console.log("Pausing before switching!")
                audio.pause()
            }
            setSource(props.url)
            setAudio(props.audio)
            setReload(true)
        }
        else if (props.url === source && reload) {
            setReload(false)
        }
        // else if (props.src === source && !reload) {
        //     console.log("song already playing!")
        // }
    })

    return (
        <div>

            {/* <AudioPlayer src={props.src} trackName={props.trackName} subreddit={props.subreddit} /> */}

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
    // console.log("props.audio in AudioPlayerBar", props)

    if (audio !== null && props.playing && duration) {
        // props.playAudio();
        // console.log("playing in audioplayerbar")
        // console.log(duration)

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
                {/* {console.log("audio in audioplayerbar", audio)} */}

                {/* <audio id="audio" >
                    <source src={source} />
                    Your browser does not support the <code>audio</code> element.
                </audio> */}
                <div className="track-info">
                    <Track trackName={trackName} subreddit={subreddit} />
                </div>
                <div className="controls">
                    {props.playing ?
                        <Pause handleClick={() => {
                            // setPlaying(false);
                            // props.dispatch({
                            //     playing: false,
                            //     subreddit: props.subreddit,
                            //     trackName: props.trackName,
                            //     audio: props.audio,
                            //     url: props.url
                            // })
                            props.togglePlaying(false)
                            audio.pause();
                        }} /> :
                        <Play handleClick={() => {
                            // setPlaying(true);
                            // props.dispatch({
                            //     // type: "STORE_AUDIO_PLAYER_INFO",
                            //     playing: true,
                            //     subreddit: props.subreddit,
                            //     trackName: props.trackName,
                            //     audio: props.audio,
                            //     url: props.url
                            // })
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

// function AudioPlayerBar({ AudioPlayerInfo, dispatch }) {
//     const { curTime, duration, setClickedTime } = useAudioPlayer(AudioPlayerInfo.audio);
//     const source = AudioPlayerInfo.url;
//     const subreddit = AudioPlayerInfo.subreddit;
//     const trackName = AudioPlayerInfo.trackName;
//     const audio = AudioPlayerInfo.audio;
//     const playing = AudioPlayerInfo.playing;
//     console.log("AudioPlayerInfo in AudioPlayerBar", AudioPlayerInfo)

//     if (audio !== null && playing && duration) {
//         // props.playAudio();
//         // console.log("playing in audioplayerbar")
//         // console.log(duration)

//         audio.play()
//     }

//     return (
//         <div>
//             <div className="player" style={{ width: "100%" }}>
//                 {/* {console.log("audio in audioplayerbar", audio)} */}

//                 {/* <audio id="audio" >
//                     <source src={source} />
//                     Your browser does not support the <code>audio</code> element.
//                 </audio> */}
//                 <div className="track-info">
//                     <Track trackName={trackName} subreddit={subreddit} />
//                 </div>
//                 <div className="controls">
//                     {playing ?
//                         <Pause handleClick={() => {
//                             // setPlaying(false);
//                             dispatch({
//                                 playing: false,
//                                 subreddit: subreddit,
//                                 trackName: trackName,
//                                 audio: audio,
//                                 url: url
//                             })
//                             audio.pause();
//                         }} /> :
//                         <Play handleClick={() => {
//                             // setPlaying(true);
//                             dispatch({
//                                 // type: "STORE_AUDIO_PLAYER_INFO",
//                                 playing: true,
//                                 subreddit: subreddit,
//                                 trackName: trackName,
//                                 audio: audio,
//                                 url: url
//                             })

//                             audio.play();
//                         }} />
//                     }
//                 </div>
//                 <div className="track-duration-info">
//                     <Bar curTime={curTime} duration={duration} onTimeUpdate={(time) => setClickedTime(time)} />
//                 </div>
//             </div>
//             <style >
//                 {`.player {
//             display:flex;
//             justify-content:center;
//             align-items:center;
//             padding: 20px 0;
//             background-color: #EAECEF;
//           }
//           .track-info{
//             margin-left:auto;
//             padding-right: 20px;
//           }
//           .track-duration-info{
//             margin-right: 10%;
//             width: 30%;
//           }
//           .controls {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             margin-right: 10%;
//             margin-left: 20%;
//           }`}
//             </style>
//         </div>
//     );
// }

export default AudioPlayerBar