import Router from "next/router"
import React from "react"
import AlbumCoverButton from "./AlbumCoverButton"
import Image from "react-bootstrap/Image";
import convertDate from "../lib/convertDate";
import { formatDurationInMin } from "../lib/formatDuration";
import processTrackName from "../lib/processTrackName";
import PlayButton from "./buttons/PlayButton";
import Pause from "./custom-audio-player/src/Pause";
import Play from "./custom-audio-player/src/Play";
import PanelTrackOptionsButtonContainer from "./containers/PanelTrackOptionsButtonContainer";
import store from "../redux/store";
import { togglePlaying } from "../redux/actions";
import { removeTrackFromCurrentPlaylist, removeTrackFromQueue, replaceCurrentTrack } from "../redux/actions/queueActions";
import { syncQueueWithAudioPlayer } from "../lib/syncQueue";
import { addToHistory } from "../redux/actions/historyActions";
import { syncHistory } from "../lib/syncHistory";
import { Track } from "../ts/interfaces";


const LeftPanel = ({history}) => {
    console.log("history", history)
    return (
        <div style={{ width: "58.1%", height: "100%", marginRight: "auto" }} >
            <div className="popular-subreddits"
                style={{ height: "50.5%", width: "100%" }}
            >
                <p style={{ height: "13%", width: "100%", fontSize: "min(1.9vh, 24px)", fontFamily: "Roboto", fontWeight: 500, color: "white", margin: "unset" }}>Popular</p>
                <div style={{ width: "100%", height: "87%", display: "flex" }}>
                    <div style={{ width: "77.15%", height: "100%", backgroundImage: "radial-gradient(circle at 0 0, #924ae6, #ae39bf, #b932b0, #a74dc2, #7f88eb, #849de4, #8762ec, #9946de)" }}></div>
                    <div style={{ width: "22.85%", height: "100%", backgroundImage: "conic-gradient(from 0.25turn, #191bb3, #4362db 0.33turn, #a041c7 0.44turn, #4660dc 0.54turn, #0cacdb 0.94turn, #191bb3)" }}></div>
                </div>
            </div>
            <div className="recently-played-subreddits"
                style={{ height: "39.4%", width: "100%", marginTop: "10.1%" }}
            >
                <p style={{ height: "16.6%", width: "100%", fontSize: "min(1.9vh, 24px)", fontFamily: "Roboto", fontWeight: 500, color: "white", margin: "unset" }}>Recently Played</p>
                <AlbumCoverButtonGroup history={history.map(track => {return {subreddit: track.subreddit, picture_url: track.picture_url}})}/>
            </div>
        </div>
    )
}

const AlbumCoverButtonGroup = ({history}) => {

    let subredditHistory = [
      ...new Set(history.map((o) => JSON.stringify(o))),
    ].map((x: string) => JSON.parse(x));

    console.log("subredditHistory", subredditHistory)

    let coversToShow;

    if (subredditHistory.length > 3){
        coversToShow = subredditHistory.slice(subredditHistory.length - 3)
    } else{
        coversToShow = subredditHistory
    }
    
    return (
        <div style={{ width: "100%", height: "83.4%", display: "flex", justifyContent: "space-between" }}>
            {coversToShow.map((subreddit, index) => {return <AlbumCoverButton key={index} src={subreddit.picture_url} width="30.8%" height="100%" handleClick={() => {Router.push(`/subreddit/${subreddit.subreddit}`)}}></AlbumCoverButton>})}
            {createEmptySquares(coversToShow.length)}
        </div>
    )
}

const createEmptySquares = (length: number) => {
    let emptySquares = []
    for (var i = 0; i < 3 - length; i++) {
        emptySquares.push(<div key={3 + i}style={{width:"30.8%", height:"100%"}} ></div>)
    }
    return emptySquares
}

const RightPanel = ({queueInfo, audioPlayerInfo}) => {

    const currTrack = queueInfo.currentTrack

    return (
        <div style={{ width: "35.5%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }} >
            <div className="current-album" style={{ height: "35.7%", width: "93%" }} >
                <p style={{ height: "18.6%", width: "100%", fontSize: "min(1.9vh, 24px)", fontFamily: "Roboto", fontWeight: 500, color: "white", margin: "unset" }}>Currently Playing</p>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", width: "100%", height: "81.4%", backgroundImage: "radial-gradient(circle at 0 0, #5c0fb2, #4018ae, #322dae, #1761aa, #2461aa, #1068a9, #243cab, #5d11ae)" }}>
                    {currTrack.cloud_storage_url !== ""
                        ?<p style={{color: "white", fontFamily: "Roboto", fontSize:"min(1.9vh, 24px)", fontWeight:500, marginRight: "2.5%", marginBottom: "1.5%"}}>{"r/" + currTrack.subreddit}</p>
                        :<div></div>
                    }
                </div>
            </div>
            <TrackList queueInfo={queueInfo} audioPlayerInfo={audioPlayerInfo}/>
        </div>
    )
}

const generatePanelQueue = (queueInfo) => {
    console.log("queueInfo", queueInfo)
    let currentPlaylistTracks = queueInfo.currentPlaylist.tracks.map((track, index) => ({track: track, playlistID: "currentPlaylist", index: index}))
    let queueTracks = []
    var j = 0;
    while (queueTracks.length < 3 - currentPlaylistTracks.length && j < queueInfo.length){
        queueTracks = queueTracks.concat(queueInfo[j].tracks.map((track, index) => ({track: track, playlistID: queueInfo[j].playlistID, index: index})))
        j += 1;
    }

    queueTracks = currentPlaylistTracks.concat(queueTracks)
    console.log("queueTracks", queueTracks)
    const trackList = []
    for(var i = 0; i < 3; i ++){
        if(i >= queueTracks.length){
            trackList.push(<div className="panel-track-info-container" key={i} style={{margin: "unset", backgroundColor: "none", marginTop: "min(6.2%, 32px)"}}></div>)

        } else{
            trackList.push(<PanelTrack key={i} track={queueTracks[i]} marginTop="min(6.2%, 32px)"/>)
        }
    }
    return trackList

}   

const PanelTrack = ({track, marginTop}) => {
    const playTrack = (trackID: string, index: number, track: Track, playlistID:string) => {

        let playing = store.getState().audioPlayerInfo.playing
        store.dispatch(togglePlaying(!playing))
    
        store.dispatch(
          replaceCurrentTrack(track)
        )
        console.log("playlistID", playlistID)
        console.log("trackID", trackID)


        if (playlistID == "currentPlaylist"){
            store.dispatch(
                removeTrackFromCurrentPlaylist(trackID, index)
              )
        } else{
            store.dispatch(
                removeTrackFromQueue(playlistID, trackID, index)
              )
        }

        syncQueueWithAudioPlayer(true)
    
        store.dispatch(
          addToHistory(store.getState().queueInfo.QueueInfo.currentTrack)
        )
        syncHistory()    
      }

    return(
        <div className="panel-track-info-container" style={{margin: "unset", marginTop: marginTop}}>
        <div className="panel-track-info">
            <Image src={track.track.picture_url} style={{height: "min(4.76vh, 60px)", marginRight: "4%"}}></Image>
            <div className="panel-track-info-text">
                <div className="panel-track-info-track-title-container">
                    <div className="panel-track-info-track-title">
                        <p style={{fontSize:"min(1vh,13px)", fontFamily: "Roboto", margin: "unset"}}>{processTrackName(track.track.track_name, 110)}</p>
                    </div>
                        <PanelTrackOptionsButtonContainer trackInfo={track.track} width="min(3.96vh, 50px)" height="min(1.58vh, 20px)"/>
                </div>
                <div className="panel-track-info-bottom">
                    <Play
                        handleClick={() => playTrack(track.track.track_id, track.index, track.track, track.playlistID)}
                        width="min(1.26vh, 16px)"
                        height="min(1.26vh, 16px)"
                        backgroundImage="linear-gradient(to bottom, white, white)"
                        playIconWidth="7"
                        playIconColor="black"
                        />
                    <p style={{fontSize:"min(0.87vh,11px)", fontFamily: "Roboto", margin: "unset"}}>{convertDate(track.track.date_posted)}</p>
                    <p style={{fontSize:"min(0.87vh,11px)", fontFamily: "Roboto", margin: "unset", marginRight: "2%"}}>{`${formatDurationInMin(track.track.audio_length)} min`}</p>
                </div>
            </div>
        </div>
    </div>
    )
}

const TrackList = ({queueInfo, audioPlayerInfo}) => {
    const playCurrentTrack = () => {
        // console.log("playing...")
        let playing = store.getState().audioPlayerInfo.playing
        store.dispatch(togglePlaying(!playing))
      }

    const currTrack = queueInfo.currentTrack
    if(currTrack.cloud_storage_url == ""){
        return (
            <div className="track-list" style={{ height: "55.1%", width: "100%", marginTop: "auto", backgroundColor: "none" }}>
                {/* <p style={{color: "white", fontFamily: "Roboto", fontSize:"min(1.9vh, 24px)", fontWeight:500, marginRight: "2.5%", marginBottom: "1.5%"}}>
                    Nothing is currently playing
                </p> */}
            </div>
        )
    }
    return(
        <div className="track-list" style={{ height: "55.1%", width: "100%", marginTop: "auto", display: "flex", flexDirection: "column"}}>
            <div className="panel-track-info-container" style={{margin: "unset", backgroundColor: "#3431ac"}}>
                <div className="panel-track-info">
                    <Image src={currTrack.picture_url} style={{height: "min(4.76vh, 60px)", marginRight: "4%"}}></Image>
                    <div className="panel-track-info-text">
                        <div className="panel-track-info-track-title-container">
                            <div className="panel-track-info-track-title">
                                <p style={{fontSize:"min(1vh,13px)", fontFamily: "Roboto", margin: "unset"}}>{processTrackName(currTrack.track_name, 110)}</p>
                            </div>
                                <PanelTrackOptionsButtonContainer trackInfo={currTrack} width="min(3.96vh, 50px)" height="min(1.58vh, 20px)"/>
                        </div>
                        <div className="panel-track-info-bottom">
                            {audioPlayerInfo.playing
                                ? <Pause
                                    handleClick={playCurrentTrack}
                                    width="min(1.26vh, 16px)"
                                    height="min(1.26vh, 16px)"
                                    backgroundImage="linear-gradient(to bottom, white, white)"
                                    playIconWidth="7"
                                    playIconColor="black"
                                    />
                                : <Play
                                    handleClick={playCurrentTrack}
                                    width="min(1.26vh, 16px)"
                                    height="min(1.26vh, 16px)"
                                    backgroundImage="linear-gradient(to bottom, white, white)"
                                    playIconWidth="7"
                                    playIconColor="black"
                                    />
                            }
                            
                            <p style={{fontSize:"min(0.87vh,11px)", fontFamily: "Roboto", margin: "unset"}}>{convertDate(currTrack.date_posted)}</p>
                            <p style={{fontSize:"min(0.87vh,11px)", fontFamily: "Roboto", margin: "unset", marginRight: "2%"}}>{`${formatDurationInMin(currTrack.audio_length)} min`}</p>
                        </div>
                    </div>
                </div>
            </div>
            {generatePanelQueue(queueInfo)}
            <style>
                {`
                    .panel-track-info-track-title-container{
                        display: flex;
                        width: 100%;
                    }
                    .panel-track-info-text{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: flex-start;
                        color: white;
                        width: 100%;
                    }
                    .panel-track-info-container{
                        width: 100%;
                        height: 27.78%;
                        margin-top: min(6.2%, 32px);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .panel-track-info{
                        width: 93%;
                        height: 71.4%; 
                        display: flex;
                    }
                    .panel-track-info-track-title{
                        width: 100%;
                    }
                    .panel-track-info-bottom{
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        width: 39%;
                        height: 29%;
                    }
                    .panel-track-info-options-button{
                        height: 5%;
                        width: 10%;
                    }
                `}
            </style>
        </div>
    )
}

const HomePanel = (props) => {
    console.log("HomePanel props", props)
    return (
        <div className="panel-container">
            <LeftPanel history={props.historyInfo.History} />
            <RightPanel queueInfo={props.queueInfo.QueueInfo} audioPlayerInfo={props.audioPlayerInfo}/>
        </div>
    )
}

export default HomePanel