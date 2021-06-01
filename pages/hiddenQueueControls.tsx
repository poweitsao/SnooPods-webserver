import Layout from "../components/layout"
import CustomNavbar from "../components/CustomNavbar"
import React, { useState, useEffect } from 'react';
import validateSession from "../lib/validateUserSessionOnPage"
import isEmpty from "../lib/isEmptyObject"
import Sidebar from "../components/Sidebar"

import AudioPlayerBarContainer from "../components/containers/AudioPlayerBarContainer";
import { Provider, useStore, useSelector } from "react-redux";
import parseCookies from "../lib/parseCookies"
import fetch from "isomorphic-unfetch"
import { connect } from "react-redux"

import store from "../redux/store";
import { storeQueueInfo, getQueueInfo, pushNextTrack, replaceCurrentTrack, addPlaylistToQueue, clearCurrentPlaylist, removeTrackFromCurrentPlaylist, removePlaylistFromQueue, removeTrackFromQueue } from "../redux/actions/queueActions";
import {QueuePlaylist, Track, UserSession} from "../ts/interfaces"

import { storeAudioPlayerInfo} from "../redux/actions/index"

import { getQueue, syncDB} from "../lib/syncQueue"
import Router from "next/router";
import LoginPopup from "../components/LoginPopup";


const hiddenQueueControls = ({ userSession }) => {
    // const store = useStore()


    const [user, setUser] = useState({})

    const [showLoginPopup, setShowLoginPopup] = useState(false)

    useEffect(() => {
      const validateUserSession = async (session_id: string, email: string) => {
        let userSession: UserSession = await validateSession(session_id, email);
        if (userSession.validSession){
          // console.log("user from validateUserSession", userSession)
          setUser(userSession)
          
          UserSessionStore.dispatch({
            type:"STORE_USER_SESSION_INFO",
            userSession
          })
          
        } else{
          Router.push("/")
        }
      }

      // const getQueue = async(email) =>{
      //     const getQueueRes = await fetch("/api/queue/getQueue/", {
      //         method: "POST", body: JSON.stringify({email: email})
      //       })
      //       let userQueueInfo = await getQueueRes.json()
      //       console.log("getQueue result:", userQueueInfo)

      //       // let currTrackInfo = {}
      //       let currTrack : Track
      //       let currentPlaylist = userQueueInfo.currentPlaylist
      //       let queue = userQueueInfo.queue

      //       if(userQueueInfo.currentTrack.length == 0){
      //         if (currentPlaylist.tracks.length == 0){
      //           // get first track from queue
      //           if(queue.length == 0){
      //             // nothing in queue. show empty player
      //             console.log("currentTrack, currPlaylist and queue are empty in db.")

      //           } else{
      //             console.log("currentTrack and currPlaylist are empty in db. grabbing currTrack from queue")

      //             currTrack = queue[0].tracks[0] 
      //             // const trackRes = await fetch("/api/getTrack/" + currTrack, {method: "GET"})
      //             // currentTrackInfo = await trackRes.json()
      //             // console.log("currentTrack", currentTrackInfo)
      //             queue[0].tracks.shift()
      //           }

      //         } else{
      //           console.log("currentTrack is empty in db. grabbing currTrack from currPlaylist")
      //           currTrack = currentPlaylist.tracks[0]
      //           // const trackRes = await fetch("/api/getTrack/" + currTrack, {method: "GET"})
      //           // currentTrackInfo = await trackRes.json()
      //           // console.log("currentTrack", currentTrackInfo)
      //           currentPlaylist.tracks.shift()
      //         }
      //       } else{
      //         // const trackRes = await fetch("/api/getTrack/" + userQueueInfo.currentTrack, {method: "GET"})
      //         // currentTrackInfo = await trackRes.json()
      //         // console.log("currentTrack", currentTrackInfo)
      //         currTrack = userQueueInfo.currentTrack
              
      //       }
            
      //       QueueStore.dispatch(
      //         storeQueueInfo({
      //           currentTrack: currTrack,
      //           currentPlaylist: currentPlaylist,
      //           queue: queue
      //         })
      //       )

      //       let currAudioStore = AudioPlayerStore.getState()
      //       console.log("currAudioStore", currAudioStore)
      //       if (currAudioStore.audio == "" && currTrack.cloud_storage_url !== ""){
      //         AudioPlayerStore.dispatch(
      //           storeAudioPlayerInfo({
      //             playing: false,
      //             subreddit: "loremipsum",
      //             trackName: currTrack.track_name,
      //             filename: currTrack.filename,
      //             audio: new Audio(currTrack.cloud_storage_url),
      //             url: currTrack.cloud_storage_url,
      //             email: userSession.email
      //           })
      //         );
      //       }
      // }

      if (userSession.session_id && userSession.email) {
        // console.log("UserSession: ", UserSessionStore.getState())
        if (!UserSessionStore.getState().validSession){
          validateUserSession(userSession.session_id, userSession.email);
        } else{
          console.log("not validating user session because it's already valid")
          setUser(UserSessionStore.getState())
        }
      } else {
        setShowLoginPopup(true)
      }

      getQueue(userSession.email)
    }, []);
    // let queueInfo = useSelector(state => state)
    // console.log(queueInfo)
    const getQueueInfoRedux = () =>{
      // console.log("getQueueInfo result", queueInfo)
      const currStore =QueueStore.getState()
      console.log(currStore)

    }

    const getCurrentTrackRedux = () =>{
      // console.log("getQueueInfo result", queueInfo)
      const currStore =QueueStore.getState()
      console.log(currStore.QueueInfo.currentTrack)

    }

    const pushNextTrackRedux = () =>{
      QueueStore.dispatch(
        pushNextTrack()
      )
      syncDB()
    }
    const replaceCurrentTrackRedux = (track) =>{
      QueueStore.dispatch(
        replaceCurrentTrack(track)
      )
      syncDB()
    }
    const addPlaylistToQueueRedux = (newPlaylist) =>{
      QueueStore.dispatch(
        addPlaylistToQueue(newPlaylist)
      )
      syncDB()
    }
    const clearCurrentPlaylistRedux = () =>{
      QueueStore.dispatch(
        clearCurrentPlaylist()
      )
      syncDB()
    }
    const removeTrackFromCurrentPlaylistRedux = (trackID, index) =>{
      QueueStore.dispatch(
        removeTrackFromCurrentPlaylist(trackID, index)
      )
      syncDB()
    }
    const removePlaylistFromQueueRedux = (playlistID) =>{
      QueueStore.dispatch(
        removePlaylistFromQueue(playlistID)
      )
      syncDB()
    }
    const removeTrackFromQueueRedux = (playlistID, trackID, index) =>{
      QueueStore.dispatch(
        removeTrackFromQueue(playlistID, trackID, index)
      )
      syncDB()
    }

    // const syncDB = async (email: string) =>{
    //   const currStore =QueueStore.getState()
    //   var res = await fetch("/api/queue/pushQueueToDB", {method: "POST", body: JSON.stringify({email: email, queueInfo: currStore.QueueInfo})})
    // }

    const emptyTrack : Track= {
      filename: "",
      cloud_storage_url: "",
      date_posted: {
          _seconds: 0,
          _nanoseconds: 0
      },
      audio_length: 0,
      track_name: "",
      track_id: ""
    }
    
    
        const testTrack : Track= {
          filename: "0Cwlemwi19LtNtXQvbTv.mp3",
          cloud_storage_url: "https://storage.cloud.google.com/snoopods-us/tracks/0Cwlemwi19LtNtXQvbTv.mp3",
          date_posted: {
              _seconds: 0,
              _nanoseconds: 0
          },
          audio_length: 81,
          track_name: "YSK it is perfectly legal to make you wear a mask, Jacobson v Mass 1905",
          track_id: "0Cwlemwi19LtNtXQvbTv"
      }
    
      const testTrack2 : Track= {
        filename: "5C94NFAopU1tShiytiuP.mp3",
        cloud_storage_url: "https://storage.cloud.google.com/snoopods-us/tracks/5C94NFAopU1tShiytiuP.mp3",
        date_posted: {
            _seconds: 0,
            _nanoseconds: 0
        },
        audio_length: 187,
        track_name: "Graduated with a 2.9 GPA and no internships, after over 400 applications I got my first offer.",
        track_id: "5C94NFAopU1tShiytiuP"
    }

    const newPlaylist = {
      playlistID: "reduxNewPlaylistID1",
      playlistName: "reduxNewPlaylistID1",
      tracks: [
        testTrack,
        testTrack2
      ]
    }

    return (
  
      <Layout>
        <div>
          <LoginPopup show={showLoginPopup}
            onHide={() => {
              setShowLoginPopup(false);
              Router.push("/")

            }} />
        </div>
        <div className="page-container">
          {isEmpty(user)
              ? <div></div>
              : <Sidebar user={user}></Sidebar>
            }
            <div className="main-page">
                {isEmpty(user)
                    ? <div></div>
                    : <CustomNavbar user={user} />
                }
                <div className="heading">
                    <h1> Queue </h1>
                </div>
                <button onClick={getQueueInfoRedux}>GET_QUEUE_INFO</button>
                <button onClick={getCurrentTrackRedux}>get current track</button>
                <button onClick={pushNextTrackRedux}>PUSH_NEXT_TRACK</button>
                <button onClick={() => replaceCurrentTrackRedux("reduxNewTrackID1")}>REPLACE_CURRENT_TRACK</button>
                <button onClick={() => addPlaylistToQueueRedux(newPlaylist)}>ADD_PLAYLIST_TO_QUEUE</button>
                <button onClick={() => removeTrackFromCurrentPlaylistRedux("1UhNCFznoAsGHuLF8NcE", 1)}>REMOVE_TRACK_FROM_CURRENT_PLAYLIST</button>
                <button onClick={clearCurrentPlaylistRedux}>CLEAR_CURRENT_PLAYLIST</button>
                <button onClick={() => removeTrackFromQueueRedux("reduxNewPlaylistID1","reduxNewTrackID2", 0)}>REMOVE_TRACK_FROM_QUEUE</button>
                <button onClick={() => removePlaylistFromQueueRedux("reduxNewPlaylistID1")}>REMOVE_PLAYLIST_FROM_QUEUE</button>
                <button onClick={() => syncDB()}>sync db</button>


                <style>{`
                .heading{
                text-align:center;
                }
                .main-page{
                width: 88%;
                margin-top:30px;
                margin-bottom:30px;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-content:center;
                align-text:center;
                align-self: flex-start;
                height: 95%;
                }
    
            .page-container{
                display: flex;
                height: 100%;
                
            }
            .button-container{
                margin:20px;
                text-align:center;
            }
            .image{
                -webkit-user-select: none;
                margin: auto;}
                .heading{
                text-align:center;
            }
            .musicPlayer{
                text-align:center;
                padding: 20px;
            }
            .grid-container{
                padding:20px;
                width: 80%;
                display: flex;
                justify-content:center;
                align-self:center;
                margin-right: 50px;
                margin-left:50px;
                max-width: 690px;
            }
            .navbar{
                display:flex;
                flex-direction: column;
                align-items: stretch;
            }
        `}</style>
            </div>
        </div>
        <div>
            <Provider store={AudioPlayerStore}>
                <AudioPlayerBarContainer />
            </Provider>
        </div>
        
      </Layout >
  
    )
  }

  hiddenQueueControls.getInitialProps = async ({ req }) => {
    const cookies = parseCookies(req)
    return {
      userSession: {
        "session_id": cookies.session_id,
        "email": cookies.email
      }
    };
  }
  
function mapStateToProps(state, ownProps) {
  // console.log("mapStateToProps", state)
  return state
}

const mapDispatchToProps = (dispatch) => ({
    // changeAudioPlayerInfo: AudioPlayerInfo => dispatch(storeAudioPlayerInfo(AudioPlayerInfo)),
    // togglePlaying: playing => dispatch(togglePlaying(playing))
    changeQueueInfo: QueueInfo => dispatch(storeQueueInfo(QueueInfo)), 
    // getQueueInfo, 
    nextTrack: () => dispatch(replaceCurrentTrack()), 
    playNewTrack: (track) => dispatch(replaceCurrentTrack(track)), 
    addPlaylistToQueue: (newPlaylist) => dispatch(addPlaylistToQueue(newPlaylist)), 
    clearCurrentPlaylist: () => dispatch(clearCurrentPlaylist()), 
    removeTrackFromCurrentPlaylist: (trackID, index) => dispatch(removeTrackFromCurrentPlaylist(trackID, index)), 
    removePlaylistFromQueue: (playlistID) => dispatch(removePlaylistFromQueue(playlistID)), 
    removeTrackFromQueue: (playlistID, trackID, index) => dispatch(removeTrackFromQueue(playlistID, trackID, index))

})

// export default connect(mapStateToProps, mapDispatchToProps)(Queue)

export default hiddenQueueControls