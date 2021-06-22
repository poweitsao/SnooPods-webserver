
import { Collection, Timestamp, Track, UserSession } from "../ts/interfaces";
import parseCookies from "../lib/parseCookies";
import { server } from "../config";
import React, { useEffect, useState } from "react";
import useSWR, { trigger } from "swr";
import Layout from "../components/layout"
import store from "../redux/store";
import Router from "next/router";
import validateSession from "../lib/validateUserSessionOnPage";
import { getQueue } from "../lib/syncQueue";
import { replaceCurrentPlaylist, replaceCurrentTrack } from "../redux/actions/queueActions";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import { Icon } from "@iconify/react";
import formatDuration from "../lib/formatDuration";
import convertDate from "../lib/convertDate";
import CollectionsTrackOptionsButton from "../components/buttons/CollectionsTrackOptionsButton";
import { Table } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import LaunchIcon from "@material-ui/icons/Launch";
import PlaylistOptionsButton from "../components/buttons/PlaylistOptionsButton";
import AudioPlayerBarContainer from "../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import LoginPopup from "../components/LoginPopup";
import isEmpty from "../lib/isEmptyObject";
import Sidebar from "../components/sidebar/Sidebar";
import CustomNavbar from "../components/navbar/CustomNavbar";

import EditNameModal from "../components/EditNameModal"
import EditIcon from '@material-ui/icons/Edit';

import CollectionTableList from "../components/CollectionTableList"
import HistoryTableList from "../components/HistoryTableList";
import EmptySideBar from "../components/sidebar/EmptySideBar";
import userSessionInfoReducer from "../redux/reducers/userSessionInfoReducer";


const HistoryPage = ({ userSession, collectionID }) => {

    const fetcher = (url) => fetch(url).then((r) => r.json());
    const fetchCollectionURL = "/api/user/history/get/" + userSession.email

    var tracks
    if(userSession.email){
      const {data} = useSWR(fetchCollectionURL, fetcher)
      tracks = data
    }

    const [mounted, setMounted] = useState<Boolean>(false);
    const [user, setUser] = useState<UserSession | {}>({});
    const [showLoginPopup, setShowLoginPopup] = useState<Boolean>(false)


    useEffect(() => {

      setMounted(true);
  
      const validateUserSession = async (session_id: string, email: string) => {
        let userSession: UserSession = await validateSession(session_id, email);
        if (userSession.validSession){
          // console.log("user from validateUserSession", userSession)
          setUser(userSession)
          store.dispatch({
            type:"STORE_USER_SESSION_INFO",
            userSession
          })
        } else{
          Router.push("/")
        }
      }
  
      if (userSession.session_id && userSession.email) {
        // console.log("UserSession: ", store.getState().userSessionInfo)
        if (!store.getState().userSessionInfo.validSession){
          validateUserSession(userSession.session_id, userSession.email);
        } else{
          console.log("not validating user session because it's already valid")
          setUser(store.getState().userSessionInfo)
        }
        
  
      } else {
        setShowLoginPopup(true)
      }
      if (userSession.email){
        getQueue(userSession.email)
      }
    }, []);

    if(tracks){
      console.log("history tracks", tracks)

    }
  
    const HistoryInfo = (props) => {
      const [mounted, setMounted] = useState(false)
      const [show, setShow] = useState(false);
    

      useEffect(() => {
          setMounted(true)
        }, [])
      return (
        <div className="subreddit-info-container">
          <Image
            className="album-cover"
            rounded
            src={props.albumCover}
            width="256px"
            height="256px"
          />
          <div className="subreddit-title">
            <div style={{display: "flex", alignItems: "center"}}>
              <h1>{"History"}</h1>
            </div>
            {/* <PlaylistOptionsButton playlist={props.playlist}/> */}
            
          </div>
          <style>{`
                  .subreddit-info-container{
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      padding: 20px;
                  }
                  .subreddit-title{
                      padding:20px;
                  }
              `}</style>
        </div>
      );
    };



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
        ? <EmptySideBar />
        : <Sidebar user={user}></Sidebar>}

        <div className="main-page">
          {isEmpty(user) ? <div></div> : <CustomNavbar user={user} />}

          <div className="page-body">

              <HistoryInfo albumCover={"https://img.icons8.com/dusk/64800000000/order-history.png"} />

            {tracks == undefined ? (
              <div></div>
            ) : (
              // <Tablelist playlist={playlist} />
              <Provider store={store}>
                <HistoryTableList tracks={tracks}/>
              </Provider>
            )}
          </div>
        </div>
        <Provider store={store}>
          <AudioPlayerBarContainer />
        </Provider>
        {/* ; */}
        <style>
          {`.page-body{
            display:flex;
            flex-direction:column;
            justify-content:nowrap;
            align-items:center;
            
            overflow-y: scroll;
            }
            .main-page{
              width: 86.25%;
              height: 90.5%;
              display:flex;
              flex-direction:column;
              align-content:center;
              align-text:center;
              align-self: flex-start;
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




HistoryPage.getInitialProps = async ({ req, query }) => {
    const cookies = parseCookies(req);

    // const collectionID: string = query["collectionID"].toString();
    let email
    if (!cookies.email){
      email = null
    } else{
      email = cookies.email
    }

    return {
      userSession: {
        session_id: cookies.session_id,
        email: email,
      }
    };
  };
  
  export default HistoryPage;