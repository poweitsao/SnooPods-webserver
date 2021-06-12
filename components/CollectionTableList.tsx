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
import Sidebar from "./sidebar/Sidebar";
import CustomNavbar from "./navbar/CustomNavbar";

import EditNameModal from "./EditNameModal"
import EditIcon from '@material-ui/icons/Edit';
import PlayButton from "./buttons/PlayButton"
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import toggleLike from "../lib/toggleLike"
import { syncHistory } from "../lib/syncHistory";
import InfiniteScroll from "react-infinite-scroll-component";

const CollectionTableList = (props) => {
    const {email} = props.userSessionInfo

    let {playlist} = props
    const trackIDs: Array<string> = playlist.tracks
    // console.log("props in CollectionTableList", props)
    let likedTracks = props.likedTracksInfo.LikedTracks
    let likedTracksCollectionID = props.likedTracksInfo.likedTracksCollectionID

    useEffect(()=>{
      const getInitialTracks = async () => {
        var currentTrackIDs = trackIDs
        if (trackIDs.length > 10){
          currentTrackIDs = trackIDs.slice(0, 9)
        }
        console.log("currentTrackIDs", currentTrackIDs)
        const getTracksRes = await fetch("/api/tracks/getTracks", {method: "POST", body:JSON.stringify({trackIDs: currentTrackIDs})})
  
        const newTracks : Array<Track> = await getTracksRes.json()
        console.log("newTracks", newTracks)
        setTrackIDIndex(trackIDIndex + newTracks.length)
        setTracks(newTracks)
      }
  
      getInitialTracks()
  
    }, [])

    const playPodcast = async (trackKey: string, trackIndex: number,  tracks: Array<Track>, collectionName: string) => {
    

      var queuePlaylistTracks = []
      var trackIDsAfter = trackIDs.slice(trackIndex)
      var playlistName = collectionName
  
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
    
    const renderTrackOnTable = (track: Track, index: number, tracks: Array<Track>, options?: any) => {
    // const [playButton, setPlayButton] = useState(playCircleOutlined);
    // console.log(index)
    // console.log("likedtracks in rendertrack", options.likedTracks)

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

    const [tracks, setTracks] = useState<Array<Track>>([])
    const [trackIDIndex, setTrackIDIndex] = useState(0)
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
    const loading = <div key={"loading"}>loading...</div>

    return (
      <div style={{ width: "100%" }}>
        {/* <ListGroup variant="flush"></ListGroup> */}
        <InfiniteScroll
          dataLength={tracks.length}
          next={loadMore}
          hasMore={trackIDIndex < trackIDs.length}
          loader={loading}
          scrollableTarget="page-body"
          style={{ width: "100%" }}
          >
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
                  {   collectionName: playlist.collectionName, 
                      collectionID: playlist.collectionID, 
                      likedTracks: likedTracks, 
                      likedTracksCollectionID: likedTracksCollectionID
                  })
                })}</tbody>
          </Table>
        </InfiniteScroll>



      </div>
    );
}



function mapStateToProps(state, ownProps) {
    // console.log("mapStateToProps", state)
    return state
  }
  
  const mapDispatchToProps = (dispatch) => ({
  
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(CollectionTableList)