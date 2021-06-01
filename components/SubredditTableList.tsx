import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import parseCookies from "../lib/parseCookies";
import validateSession from "../lib/validateUserSessionOnPage";
import Router from "next/router";
import Cookie, { set } from "js-cookie";
import Layout from "./layout";
import CustomNavbar from "./CustomNavbar";
import AudioPlayerBar from "./AudioPlayerBar";
import AudioPlayerBarContainer from "./containers/AudioPlayerBarContainer";
import { connect, Provider } from "react-redux";
import store from "../redux/store";
import { storeAudioPlayerInfo, togglePlaying } from "../redux/actions/index";
import Image from "react-bootstrap/Image";

import formatDuration from "../lib/formatDuration";

import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";

import fetch from "isomorphic-unfetch";

import { Icon, IconifyIcon, InlineIcon } from "@iconify/react";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import LaunchIcon from "@material-ui/icons/Launch";
import { Collection, Timestamp, Track, UserSession } from "../ts/interfaces";
import useWindowDimensions from "./hooks/useWindowDimensions";
import TrackOptionsButton from "./buttons/TrackOptionsButton"

import Sidebar from "./Sidebar";
import useSWR, { trigger } from "swr";
import { server } from "../config";


import { storeQueueInfo, getQueueInfo, pushNextTrack, replaceCurrentTrack, addPlaylistToQueue, clearCurrentPlaylist, removeTrackFromCurrentPlaylist, removePlaylistFromQueue, removeTrackFromQueue, replaceCurrentPlaylist } from "../redux/actions/queueActions";
import {syncDB, getQueue} from "../lib/syncQueue"

import LoginPopup from "./LoginPopup";

import PlaylistOptionsButton from "./buttons/PlaylistOptionsButton"
import convertDate from "../lib/convertDate";

import TrackOptionsButtonContainer from "./containers/TrackOptionsButtonContainer"
import PlayButton from "./buttons/PlayButton"
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import toggleLike from "../lib/toggleLike"


const SubredditTableList = (props) => {
  const {playlist, subID} : 
  {playlist: Collection, subID: string} = props

  const { LikedTracks, likedTracksCollectionID } : {LikedTracks: Array<string>, likedTracksCollectionID: string} = props.likedTracksInfo

  const playPodcast = (trackKey: string, trackIndex: number) => {

    var queuePlaylistTracks = []
    for(var i = trackIndex + 1; i <playlist.keys.length; i++ ){
      queuePlaylistTracks.push(playlist.tracks[playlist.keys[i]])
    }

    // console.log("queuePlaylistTracks", queuePlaylistTracks)
    var currStore = store.getState().queueInfo
    // console.log("store before dispatch", currStore)

    if (queuePlaylistTracks.length > 0){
      var playlistName = "r/" + subID

      var queuePlaylist = createQueuePlaylist(queuePlaylistTracks, playlistName)
      // console.log("queuePlaylist", queuePlaylist)
      store.dispatch(
        replaceCurrentPlaylist(queuePlaylist)
      )
      
    
    
    }
    store.dispatch(
      replaceCurrentTrack(playlist.tracks[trackKey])
    )
    currStore = store.getState().queueInfo
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

  const renderTrackOnTable = (trackKey: string, index: number, options?:any) => {
    let track = playlist.tracks[trackKey]
    // console.log("----> renderTrackOnTable. likedTracks:", track.track_name)

      // const [playButton, setPlayButton] = useState(playCircleOutlined);
      // console.log(index)
    return (
      <tr key={track.track_name}>
        <td style={{ width: "5%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "12px",
            }}
          >
              {/* <button 
                  onClick={() => playPodcast(trackKey, index)}
                  onMouseEnter={() => setPlayButton(playCircleFilled)}
                  onMouseLeave={() => setPlayButton(playCircleOutlined)}
                  style={{
                    padding: "0px",
                    width: "fit-content",
                    backgroundColor: "transparent",
                    border: "none"

                    }}>
                <Icon
                  style={{ width: "25px", height: "25px" }}
                  icon={playButton}
                />
              </button> */}
            <PlayButton handleClick={() => playPodcast(trackKey, index)}/>
          </div>
        </td>
        <td style={{ width: "60%" }}>
          {track.track_name ? (
            <div className="post-title">
              {track.track_name}
            </div>
          ) : (
            <div className="filename">
              {track["filename"]}
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
          {track["audio_length"] ? (
            <div style={{display: "flex", alignItems: "center"}}>
              <div className="audio-length">
                {formatDuration(track["audio_length"])}
              </div>
            </div>
          ) : (
            <div className="audio-length-dummy">{"audioLength"}</div>
          )}
        </td>
        <td style={{ width: "15%" }}>
          {track["date_posted"] ? (
            <div className="date-posted" style={{display: "flex", alignItems: "center"}}>
              {convertDate(track["date_posted"])}
              <div style={{padding: "10px"}}>
                <Provider store={store}>
                  <TrackOptionsButtonContainer trackInfo={playlist.tracks[trackKey]}/>
                </Provider>

                {/* <TrackOptionsButton /> */}
                </div>
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

  // const toggleLike = async (track: Track) => {
  //   // console.log("toggling like for:", track.track_id)
  //   let email = store.getState().userSessionInfo.email
  //   await fetch("/api/user/collections/likedTracks/toggleLike", 
  //       {method: "POST", 
  //       body: JSON.stringify({email: email, trackID: track.track_id })})
  //   trigger("/api/user/collections/likedTracks/get/"+ email)
  // }
    
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
          <tbody>{
            playlist["keys"].map((trackKey, index) => { 
              return renderTrackOnTable(trackKey, index, {likedTracks: LikedTracks, likedTracksCollectionID: likedTracksCollectionID})})
          }
          </tbody>
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

export default connect(mapStateToProps, mapDispatchToProps)(SubredditTableList)