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


import { LikedTracksStore, QueueStore, UserSessionStore } from "../redux/store";
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
import { propTypes } from "react-bootstrap/esm/Image";


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
              
              <Provider store={QueueStore}>
                <QueuePageBodyContainer/>
              </Provider>
            </div>
          
          <Provider store={AudioPlayerStore}>
            <AudioPlayerBarContainer />
          </Provider>
          <style>

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


