import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import parseCookies from "../lib/parseCookies";
import validateSession from "../lib/validateUserSessionOnPage";
import Router from "next/router";
import Cookie, { set } from "js-cookie";
import Layout from "./layout";
import CustomNavbar from "./navbar/CustomNavbar";
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

import Sidebar from "./sidebar/Sidebar";
import useSWR, { trigger } from "swr";
import { server } from "../config";


import { storeQueueInfo, getQueueInfo, pushNextTrack, replaceCurrentTrack, addPlaylistToQueue, clearCurrentPlaylist, removeTrackFromCurrentPlaylist, removePlaylistFromQueue, removeTrackFromQueue, replaceCurrentPlaylist } from "../redux/actions/queueActions";
import { syncDB, getQueue } from "../lib/syncQueue"

import LoginPopup from "./LoginPopup";

import PlaylistOptionsButton from "./buttons/PlaylistOptionsButton"
import convertDate from "../lib/convertDate";

import TrackOptionsButtonContainer from "./containers/TrackOptionsButtonContainer"
import PlayButton from "./buttons/PlayButton"
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import toggleLike from "../lib/toggleLike"
import { addToHistory } from "../redux/actions/historyActions";
import { syncHistory } from "../lib/syncHistory";

import InfiniteScroll from 'react-infinite-scroll-component';


const SubredditTableList = (props) => {
  const { playlist }:
    { playlist: any} = props
  
  const {scrollableTarget} :{ scrollableTarget: any}= props
  const {hi} = props

  console.log("playlist in SubredditTableList", playlist)

  console.log("scrollableTarget in SubredditTableList", scrollableTarget.current)
  console.log("hi in SubredditTableList", hi)


  const {email} = props.userSessionInfo

  const trackIDs: Array<string> = playlist.trackIDs

  const { LikedTracks, likedTracksCollectionID }: { LikedTracks: Array<string>, likedTracksCollectionID: string } = props.likedTracksInfo

  const playPodcast = async (track: Track, trackIndex: number, trackIDs: Array<string>) => {

    var queuePlaylistTracks = []
    var trackIDsAfter = trackIDs.slice(trackIndex)
    var playlistName = playlist.collectionName

    const addToCurrentPlaylistRes = await fetch("/api/queue/addToCurrentPlaylist", 
      {method: "POST", body: JSON.stringify({email: email, trackIDs: trackIDsAfter, playlistName: playlistName})
    })
    var result = await addToCurrentPlaylistRes.json()

    await getQueue(store.getState().userSessionInfo.email)
    var currStore = store.getState().queueInfo
    let currTrack = currStore.QueueInfo.currentTrack
    // syncDB(cookies.email)
    store.dispatch(
      storeAudioPlayerInfo({
        playing: true,
        trackName: currTrack.track_name,
        filename: currTrack.filename,
        audio: new Audio(currTrack.cloud_storage_url),
        url: currTrack.cloud_storage_url,
        email: store.getState().userSessionInfo.email,
        subreddit: currTrack.subreddit,
        pictureURL: currTrack.picture_url
      },
      )
    )
    store.dispatch(
      addToHistory(store.getState().queueInfo.QueueInfo.currentTrack)
    )
    syncHistory()

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

  const renderTrackOnTable = (track: Track, index: number, options?: any) => {
    // let track = playlist.tracks[trackKey]

    return (
      <tr key={track.track_id + index.toString()}>
        <td style={{ width: "5%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "12px",
            }}
          >

            <PlayButton handleClick={() => playPodcast(track, index, trackIDs)} />
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
          <button
            style={{
              padding: "0px",
              width: "fit-content",
              backgroundColor: "transparent",
              border: "none"
            }}
            onClick={() => toggleLike(track, options.likedTracksCollectionID)}
          >
            {options.likedTracks.includes(track.track_id)
              ? <FavoriteIcon />
              : <FavoriteBorderIcon />
            }
          </button>
        </td>
        <td style={{ width: "10%" }}>
          {track["audio_length"] ? (
            <div style={{ display: "flex", alignItems: "center" }}>
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
            <div className="date-posted" style={{ display: "flex", alignItems: "center" }}>
              {convertDate(track["date_posted"])}
              <div style={{ padding: "10px" }}>
                <Provider store={store}>
                  <TrackOptionsButtonContainer trackInfo={track} />
                </Provider>

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

  const loadMore = () => {
    console.log("loadMore called")
    var trackIDsToLoad = []
    if(trackIDIndex + 10 <= trackIDs.length){
      trackIDsToLoad = trackIDs.slice(trackIDIndex, trackIDIndex+ 10)
    } else{
      trackIDsToLoad = trackIDs.slice(trackIDIndex)

    }
    console.log("hi")
    // trackIDIndex += trackIDsToLoad.length
    setTrackIDIndex(trackIDIndex + trackIDsToLoad.length)


    fetch("/api/tracks/getTracks", 
      {method: "POST", body:JSON.stringify({trackIDs: trackIDsToLoad})}
    ).then((getTracksRes) => {
      getTracksRes.json().then(
        (getTracksResult) => {
          console.log("new track index", trackIDIndex, "+", getTracksResult.length)
          console.log("hi2")
          setTracks(tracks => [...tracks, ...getTracksResult])
        }
      )
    })
    // var getTracksResult = await getTracksRes.json()



  }

  // const toggleLike = async (track: Track) => {
  //   // console.log("toggling like for:", track.track_id)
  //   let email = store.getState().userSessionInfo.email
  //   await fetch("/api/user/collections/likedTracks/toggleLike", 
  //       {method: "POST", 
  //       body: JSON.stringify({email: email, trackID: track.track_id })})
  //   trigger("/api/user/collections/likedTracks/get/"+ email)
  // }

  const [tracks, setTracks] = useState<Array<Track>>([])
  const [trackIDIndex, setTrackIDIndex] = useState(0)
  // var trackIDIndex = 0
  

  useEffect(()=>{
    const getInitialTracks = async () => {
      var currentTrackIDs = trackIDs
      if (trackIDs.length > 10){
        currentTrackIDs = trackIDs.slice(0, 9)
      }
      const getTracksRes = await fetch("/api/tracks/getTracks", {method: "POST", body:JSON.stringify({trackIDs: currentTrackIDs})})

      const newTracks : Array<Track> = await getTracksRes.json()
      console.log("newTracks", newTracks)
      setTrackIDIndex(trackIDIndex + newTracks.length)
      setTracks(newTracks)
    }

    getInitialTracks()

  }, [])
  const loading = <div key={"loading"}>loading...</div>

  return (
    <div style={{ width: "100%" }}>
    <button onClick={() => console.log("scrollableTarget.current", scrollableTarget)}>click</button>
    {
      scrollableTarget.current 
      ? <InfiniteScroll
          dataLength={tracks.length}  
          next={loadMore}
          hasMore={trackIDIndex < trackIDs.length}
          loader={loading}
          scrollableTarget={scrollableTarget.current}
          style={{ width: "100%" }}>
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
            <tbody>
              {
                tracks.map((trackKey, index) => {
                  return renderTrackOnTable(trackKey, index, { likedTracks: LikedTracks, likedTracksCollectionID: likedTracksCollectionID })
                })
              }
              
            </tbody>
          </Table>
          {/* <button onClick={() => {console.log(trackIDIndex, trackIDs.length)}}>has more?</button> */}
      </InfiniteScroll>


      : <div></div>

    }
    
    {/* <InfiniteScroll
      initialLoad={true}
      loadMore={loadMore}
      hasMore={trackIDIndex < trackIDs.length}
      loader={loading}
      threshold={100}
      style={{ width: "100%" }}
    > */}

        {/* <ListGroup variant="flush"></ListGroup> */}

        
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