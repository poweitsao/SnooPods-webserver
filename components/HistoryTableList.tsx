import { Collection, Timestamp, Track, UserSession } from "../ts/interfaces";
import parseCookies from "../lib/parseCookies";
import { server } from "../config";
import React, { useEffect, useState } from "react";
import useSWR, { trigger } from "swr";
import Layout from "./layout"
import store from "../redux/store";
import Router from "next/router";
import validateSession from "../lib/validateUserSessionOnPage";
import { getQueue } from "../lib/syncQueue";
import { replaceCurrentPlaylist, replaceCurrentTrack } from "../redux/actions/queueActions";
import { storeAudioPlayerInfo } from "../redux/actions";
import { addToHistory } from "../redux/actions/historyActions"
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import { Icon } from "@iconify/react";
import formatDuration from "../lib/formatDuration";
import convertDate from "../lib/convertDate";
import CollectionsTrackOptionsButton from "./buttons/CollectionsTrackOptionsButton";
import { Table } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import LaunchIcon from "@material-ui/icons/Launch";
import PlaylistOptionsButton from "./buttons/PlaylistOptionsButton";
import AudioPlayerBarContainer from "./containers/AudioPlayerBarContainer";
import { connect, Provider } from "react-redux";
import LoginPopup from "./LoginPopup";
import isEmpty from "../lib/isEmptyObject";
import Sidebar from "./Sidebar";
import CustomNavbar from "./CustomNavbar";

import EditNameModal from "./EditNameModal"
import EditIcon from '@material-ui/icons/Edit';
import PlayButton from "./buttons/PlayButton"
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import toggleLike from "../lib/toggleLike"
import { syncHistory } from "../lib/syncHistory";

const HistoryTableList = (props) => {
    let {tracks} = props
    // console.log("props in HistoryTableList", props)
    let likedTracks = props.likedTracksInfo.LikedTracks
    let likedTracksCollectionID = props.likedTracksInfo.likedTracksCollectionID

    const playPodcast = (trackKey: string, trackIndex: number,  tracks: Array<Track>, collectionName: string) => {
        store.dispatch(
          replaceCurrentTrack(tracks[trackIndex])
        )
        var currStore = store.getState().queueInfo
        // console.log("currStore after replace ", currStore )
        let currTrack = currStore.QueueInfo.currentTrack
        // syncDB(cookies.email)
        store.dispatch(
          storeAudioPlayerInfo({
            playing: true,
            subreddit: "loremipsum",
            trackName: currTrack.track_name,
            filename: currTrack.filename,
            audio: new Audio(currTrack.cloud_storage_url),
            url: currTrack.cloud_storage_url,
            email: store.getState().userSessionInfo.email}
          )
        )

        store.dispatch(
          addToHistory(store.getState().queueInfo.QueueInfo.currentTrack)
        )
        syncHistory()
        trigger("/api/user/history/getTracks/" + store.getState().userSessionInfo.email)
    
    };
    
    const createQueuePlaylist = (tracks: Array<Track>, playlistName: string) => {
    var playlistID = generateID()
    return {
        playlistID: playlistID,
        playlistName: playlistName,
        tracks: tracks
    }

    }
    
    const generateID = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    
    const renderTrackOnTable = (track: Track, index: number, tracks: Array<Track>, options?: any) => {
    // const [playButton, setPlayButton] = useState(playCircleOutlined);
    // console.log(index)
    // console.log("likedtracks in rendertrack", options.likedTracks)
      console.log("track in renderTrackOnTable", track)
    return (
        <tr key={index}>
        <td style={{ width: "5%" }}>
            <div
            style={{
                display: "flex",
                justifyContent: "center",
                paddingLeft: "12px",
            }}
            >
            <PlayButton handleClick={() => playPodcast(track.track_id, index, tracks, options.collectionName)}/>
            </div>
        </td>
        <td style={{ width: "60%" }}>
            {track.track_name ? (
            <div className="post-title">
                {track.track_name}
            </div>
            ) : (
            <div className="filename">
                {track.filename}
            </div>
            )}
        </td>
        <td style={{ width: "5%" }}>
                <button style={{
                            padding: "0px",
                            width: "fit-content",
                            backgroundColor: "transparent",
                            border: "none"
                        }}
                        onClick={() => toggleLike(track, options.likedTracksCollectionID)}

                >
                    {options.likedTracks.includes(track.track_id)
                        ? <FavoriteIcon/>
                        : <FavoriteBorderIcon/>
                    }
                </button>
            </td>
        <td style={{ width: "10%" }}>
            {track.audio_length ? (
            <div style={{display: "flex", alignItems: "center"}}>
                <div className="audio-length">
                {formatDuration(track.audio_length)}
                </div>
            </div>
            ) : (
            <div className="audio-length-dummy">{"audioLength"}</div>
            )}
        </td>
        <td style={{ width: "15%" }}>
            {track.date_posted ? (
            <div className="date-posted" style={{display: "flex", alignItems: "center"}}>
                {convertDate(track.date_posted)}
                <div style={{padding: "10px"}}><CollectionsTrackOptionsButton collectionID={options.collectionID} trackInfo={track} index={index}/></div>
            </div>
            ) : (
            <div className="date-posted-dummy">{"datePosted"}</div>
            )}
        </td>

        <style>{`
            .table td{
            padding: 10px;
            vertical-align: unset;
            }
        `}</style>
        </tr>
    );
    };

    // const toggleLike = async (track: Track, likedTracksCollectionID: string) => {
    //     // console.log("toggling like for:", track.track_id)
    //     let email = store.getState().userSessionInfo.email
    //     await fetch("/api/user/collections/likedTracks/toggleLike", 
    //         {method: "POST", 
    //         body: JSON.stringify({email: email, trackID: track.track_id })})
    //     trigger("/api/user/collections/likedTracks/get/"+ email)
    //     trigger("/api/user/collections/get/" + email + "/" + likedTracksCollectionID)

    //   }
    // const toggleLike = async (track: Track, likedTracksCollectionID: string) => {
    //     // console.log("toggling like for:", track.track_id)
    //     let email = store.getState().userSessionInfo.email
    //     await fetch("/api/user/collections/likedTracks/toggleLike", 
    //         {method: "POST", 
    //         body: JSON.stringify({email: email, trackID: track.track_id })})
    //     trigger("/api/user/collections/likedTracks/get/"+ email)
    //     trigger("/api/user/collections/get/" + email + "/" + likedTracksCollectionID)
    
    // }

    // console.log("playlist in Tablelist", playlist)
    return (
      <div style={{ width: "100%" }}>
        {/* <ListGroup variant="flush"></ListGroup> */}
        <Table responsive hover>
          {/* <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item> */}
          <thead>
            <tr>
              <td></td>
              <td>Title</td>
              <td></td>
              <td>Duration</td>
              <td>Date posted</td>
            </tr>
          </thead>
          <tbody>{tracks.map(
            (track, index, array) => {
              return renderTrackOnTable(track, index, array, 
                {   likedTracks: likedTracks, 
                    likedTracksCollectionID: likedTracksCollectionID
                })
              })}</tbody>
        </Table>
      </div>
    );
}


function mapStateToProps(state, ownProps) {
    // console.log("mapStateToProps", state)
    return state
  }
  
  const mapDispatchToProps = (dispatch) => ({
  
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(HistoryTableList)