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


import { QueueStore, UserSessionStore } from "../redux/store";
import { storeQueueInfo, getQueueInfo, pushNextTrack, replaceCurrentTrack, addPlaylistToQueue, clearCurrentPlaylist, removeTrackFromCurrentPlaylist, removePlaylistFromQueue, removeTrackFromQueue } from "../redux/actions/queueActions";
import {Collection, QueuePlaylist, Track, UserSession} from "../ts/interfaces"

import { AudioPlayerStore } from "../redux/store";
import { storeAudioPlayerInfo, togglePlaying} from "../redux/actions/index"

import { getQueue, syncDB, syncQueueWithAudioPlayer} from "../lib/syncQueue"
import Router from "next/router";
import LoginPopup from "../components/LoginPopup";
import { Table } from "react-bootstrap";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import Icon from "@iconify/react";
import formatDuration from "../lib/formatDuration";
import TrackOptionsButton from "../components/buttons/TrackOptionsButton";
import convertDate from "../lib/convertDate";

import QueuePageBodyContainer from "../components/containers/QueuePageBodyContainer"


const Queue = ({ userSession }) => {
    // const store = useStore()


    const [user, setUser] = useState({})

    const [showLoginPopup, setShowLoginPopup] = useState(false)
    const playlist = false;
    const [queueDisplayInfo, setQueueDisplayInfo] = useState({})


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

      const waitForGetQueue = async () =>{
        let queueInfo = await getQueue(userSession.email)
        console.log("queueInfo from getQueue", queueInfo)
        // setQueueDisplayInfo(queueInfo)
      }

      if (isEmpty(queueDisplayInfo)){
        waitForGetQueue()
      } 
      
      // setQueueDisplayInfo(queueInfo)
    }, [queueDisplayInfo]);
    // console.log("queueDisplayInfo", queueDisplayInfo)


    // const renderTrackOnTable = (track: Track, index: number, array: Array<Track>, options?: any) => {
    //   const [playButton, setPlayButton] = useState(playCircleOutlined);
    //   // console.log(index)
    //   return (
    //     <tr key={track.track_id}>
    //       <td style={{ width: "5%" }}>
    //         <div
    //           style={{
    //             display: "flex",
    //             justifyContent: "center",
    //             paddingLeft: "12px",
    //           }}
    //         >
    //           <button 
    //               onClick={() => options?.playTrack(track.track_id, index, track, options?.playlistID)}
    //               onMouseEnter={() => setPlayButton(playCircleFilled)}
    //               onMouseLeave={() => setPlayButton(playCircleOutlined)}
    //               style={{
    //                 padding: "0px",
    //                 width: "fit-content",
    //                 backgroundColor: "transparent",
    //                 border: "none"
  
    //                 }}>
    //             <Icon
    //               style={{ width: "25px", height: "25px" }}
    //               icon={playButton}
    //             />
    //           </button>
    //         </div>
    //       </td>
    //       <td style={{ width: "60%" }}>
    //         {array[index]["track_name"] ? (
    //           <div className="post-title">
    //             {array[index]["track_name"]}
    //           </div>
    //         ) : (
    //           <div className="filename">
    //             {array[index]["filename"]}
    //           </div>
    //         )}
    //       </td>
    //       <td style={{ width: "10%" }}>
    //         {array[index]["audio_length"] ? (
    //           <div style={{display: "flex", alignItems: "center"}}>
    //             <div className="audio-length">
    //               {formatDuration(array[index]["audio_length"])}
    //             </div>
    //           </div>
    //         ) : (
    //           <div className="audio-length-dummy">{"audioLength"}</div>
    //         )}
    //       </td>
    //       <td style={{ width: "15%" }}>
    //         {array[index]["date_posted"] ? (
    //           <div className="date-posted" style={{display: "flex", alignItems: "center"}}>
    //             {convertDate(array[index]["date_posted"])}
    //             <div style={{padding: "10px"}}><QueueCurrentPlaylistOptionsButton setQueueDisplayInfo={setQueueDisplayInfo} trackInfo={array[index]}/></div>
    //           </div>
    //         ) : (
    //           <div className="date-posted-dummy">{"datePosted"}</div>
    //         )}
    //       </td>
  
    //       <style>{`
    //         .table td{
    //           padding: 10px;
    //           vertical-align: unset;
    //         }
    //       `}</style>
    //     </tr>
    //   );
    // };
  
    // const CurrentPlaylist = ({ playlist }: { playlist: QueuePlaylist }) => {
    //   const playTrackFromCurrentPlaylist = (trackID: string, index: number, track: Track, playlistID?: string) => {

    //     let playing = AudioPlayerStore.getState().playing
    //     AudioPlayerStore.dispatch(togglePlaying(!playing))

    //     QueueStore.dispatch(
    //       replaceCurrentTrack(track)
    //     )
    //     QueueStore.dispatch(
    //       removeTrackFromCurrentPlaylist(trackID, index)
    //     )
    //     syncQueueWithAudioPlayer(true)
    //     setQueueDisplayInfo(QueueStore.getState().QueueInfo)

    //   }
    //   return (
    //     <div style={{ width: "100%" }}>
    //       {/* <ListGroup variant="flush"></ListGroup> */}
    //       <Table style={{overflowY: "visible", overflowX: "visible"}}  hover>
    //         {/* <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item> */}
    //         <thead>
    //           <tr>
    //             {/* <td></td>
    //             <td>Title</td>
    //             <td>Duration</td>
    //             <td>Date posted</td> */}
    //           </tr>
    //         </thead>
    //         <tbody>{playlist.tracks.map((track: Track, index: number, array: Array<Track>) => {
    //                   return renderTrackOnTable(track, index, array, {playTrack: playTrackFromCurrentPlaylist})
    //               })}
    //         </tbody>
    //       </Table>
    //     </div>
    //   );
    // };
  
    // const CurrentSong = ({ track }: { track: Track }) => {
    //   const playCurrentTrack = (trackID: string, index: number, track: Track, playlistID?: string) => {
    //     // console.log("playing...")
    //     let playing = AudioPlayerStore.getState().playing
    //     AudioPlayerStore.dispatch(togglePlaying(!playing))
    //   }
    //   return (
    //     <div style={{ width: "100%"}}>
    //       {/* <ListGroup variant="flush"></ListGroup> */}
    //       <Table style={{overflowY: "visible", overflowX: "visible"}}  hover >
    //         {/* <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item> */}
    //         <thead>
    //           <tr>
    //             {/* <td></td>
    //             <td>Title</td>
    //             <td>Duration</td>
    //             <td>Date posted</td> */}
    //           </tr>
    //         </thead>
    //         <tbody>{[track].map((track: Track, index: number, array: Array<Track>) => {
    //           console.log("track in currentSong.map", track, "array:", array)
    //           return renderTrackOnTable(track, index, array, {playTrack: playCurrentTrack})
    //         })
    //         }</tbody>
    //       </Table>
    //     </div>
    //   );
    // };
  
    // const CurrentQueue = ({ queue }: { queue: Array<QueuePlaylist> }) => {
    //   return (
    //     <div style={{ width: "100%" }}>
          
    //       {queue.map(QueueChunk)}
    //     </div>
    //   );
    // };
  
    // const QueueChunk = (playlist: QueuePlaylist, index: number) => {

    //   const playTrackFromCurrentQueueChunk = (trackID: string, index: number, track: Track, playlistID:string) => {

    //     let playing = AudioPlayerStore.getState().playing
    //     AudioPlayerStore.dispatch(togglePlaying(!playing))

    //     QueueStore.dispatch(
    //       replaceCurrentTrack(track)
    //     )
    //     QueueStore.dispatch(
    //       removeTrackFromQueue(playlistID, trackID, index)
    //     )
    //     syncQueueWithAudioPlayer(true)
    //     setQueueDisplayInfo(QueueStore.getState().QueueInfo)

    //   }

    //   return (
    //     <div key={playlist.playlistID}>
    //       {
    //         <div style={{padding: "10px", paddingLeft: "50px"}}>{playlist.playlistName}</div>
    //       }
          
    //       <div style={{ width: "95%", marginLeft: "auto" }}>
    //         {/* <ListGroup variant="flush"></ListGroup> */}
    //         <Table style={{overflowY: "visible", overflowX: "visible"}}  hover>
    //           {/* <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item> */}
    //           <thead>
    //             <tr>
    //               {/* <td></td>
    //               <td>Title</td>
    //               <td>Duration</td>
    //               <td>Date posted</td> */}
    //             </tr>
    //           </thead>
    //           <tbody>{playlist.tracks.map((track: Track, index: number, array: Array<Track>) => {
    //                   return renderTrackOnTable(track, index, array, {playTrack: playTrackFromCurrentQueueChunk, playlistID: playlist.playlistID})
    //         })}</tbody>
    //         </Table>
    //       </div>
    //     </div>
    //   );
  
    // }





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
          {isEmpty(user) ? <div></div> : <Sidebar user={user}></Sidebar>}
          <div className="main-page">
            {isEmpty(user) ? <div></div> : <CustomNavbar user={user} />}
            <div></div>
            {/* <div className="page-body">
              {isEmpty(queueDisplayInfo) ? (
                <div></div>
              ) : (
                // <SubredditInfo albumCover={playlist["cover_url"]} playlist={playlist} />
                <div style={{width: "90%"}}>
                  <div style={{ padding: "10px", paddingLeft: "25px"}}>Current Track:</div>
                  <CurrentSong track={queueDisplayInfo["currentTrack"]}/>
                </div>
              )}
              {isEmpty(queueDisplayInfo) 
              ?  <div></div>
              :(
                queueDisplayInfo["currentPlaylist"].tracks.length == 0 
                ? <div></div> 
                : (
                    // <Tablelist playlist={playlist} />
                    <div style={{width: "90%"}}>
                      <div style={{padding: "10px", paddingLeft: "25px"}}>Currently Playing:</div>
                      <CurrentPlaylist playlist={queueDisplayInfo["currentPlaylist"]}/>
                    </div>
                  )
              )}
                
              {isEmpty(queueDisplayInfo) ? (
                <div></div>
              ) : (
                // <Tablelist playlist={playlist} />
                <div style={{width: "90%"}}>
                  <div style={{padding: "10px", paddingLeft: "25px"}}>Queue:</div>
                  <CurrentQueue queue={queueDisplayInfo["queue"]}/>
                </div>
                
              )}
            </div> */}
            <Provider store={QueueStore}>
              <QueuePageBodyContainer/>
            </Provider>
          </div>
          <Provider store={AudioPlayerStore}>
            <AudioPlayerBarContainer />
          </Provider>
          {/* ; */}
          <style>
          {/* .page-body{
              margin-top: 30px;
              margin-bottom: 100px;
              display:flex;
              flex-direction:column;
              justify-content:nowrap;
              align-items:center;
              
              overflow-y: scroll;
              } */}

            {`
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
                  height: 100%
              }
  
              .album-cover{
                  padding: 20px;
              }
              .navbar{
                  display:flex;
                  flex-direction: column;
                  align-items: stretch;
              }
                      `}
          </style>
          <div>
          </div>
        </div>

      </Layout>
    )
  }






  Queue.getInitialProps = async ({ req }) => {
    const cookies = parseCookies(req)
    return {
      userSession: {
        "session_id": cookies.session_id,
        "email": cookies.email
      }
    };
  }
  


// export default connect(mapStateToProps, mapDispatchToProps)(Queue)

export default Queue


