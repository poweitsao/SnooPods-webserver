import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import parseCookies from "../../lib/parseCookies";
import validateSession from "../../lib/validateUserSessionOnPage";
import Router from "next/router";
import Cookie, { set } from "js-cookie";
import Layout from "../../components/layout";
import CustomNavbar from "../../components/CustomNavbar";
import AudioPlayerBar from "../../components/AudioPlayerBar";
import AudioPlayerBarContainer from "../../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import store from "../../redux/store";
import Image from "react-bootstrap/Image";

import formatDuration from "../../lib/formatDuration";

import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";

import fetch from "isomorphic-unfetch";

import { Icon, IconifyIcon, InlineIcon } from "@iconify/react";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import LaunchIcon from "@material-ui/icons/Launch";
import { Collection, Timestamp, Track, UserSession } from "../../ts/interfaces";
import useWindowDimensions from "../../components/hooks/useWindowDimensions";
import TrackOptionsButton from "../../components/buttons/TrackOptionsButton"

import Sidebar from "../../components/Sidebar";
import useSWR from "swr";
import { server } from "../../config";

import { storeQueueInfo, getQueueInfo, pushNextTrack, replaceCurrentTrack, addPlaylistToQueue, clearCurrentPlaylist, removeTrackFromCurrentPlaylist, removePlaylistFromQueue, removeTrackFromQueue, replaceCurrentPlaylist } from "../../redux/actions/queueActions";
import {syncDB, getQueue} from "../../lib/syncQueue"

import LoginPopup from "../../components/LoginPopup";

import PlaylistOptionsButton from "../../components/buttons/PlaylistOptionsButton"
import convertDate from "../../lib/convertDate";

import TrackOptionsButtonContainer from "../../components/containers/TrackOptionsButtonContainer"

import SubredditTableList from "../../components/SubredditTableList"
import SubredditPlaylistOptionsButton from "../../components/buttons/SubredditPlaylistOptionsButton";

function isEmpty(obj: Object) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

const Subreddit = ({ userSession, playlist }) => {
  // let emptyPlaylist: Collection = { keys: [], tracks: {}, collectionName: "" , cover_url: ""};
  // const [playlist, setPlaylist] = useState<Collection>(emptyPlaylist);
  const [mounted, setMounted] = useState<Boolean>(false);
  const [user, setUser] = useState<UserSession | {}>({});
  const [showLoginPopup, setShowLoginPopup] = useState<Boolean>(false)

  const router = useRouter();
  const subID: string = router.query["subID"].toString();
  console.log("playlist", playlist)
  // const {data: playlist} = useSWR("/api/subredditPlaylist/" + subID, {initialData:subredditPlaylist })
// const {data: collections} = useSWR("/api/user/collections/getCollections/"+ store.getState().userSessionInfo.email)
  

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
    // console.log(data)
    getQueue(userSession.email)



  }, []);


  const SubredditInfo = (props) => {
    const [mounted, setMounted] = useState(false)
    var playlist = props.playlist
    playlist.collectionName = "r/" + subID

    const getTracksTest = async() => {
      let tracks = ["08uYngvdWCiSlEjZhIG0", "0eEsDfEDvIrSGlcOlMDk", "0uzt5WvEySS800XE2eWA" ]
      let getTracksResponse = await fetch("/api/getTracks", {method: "POST", body: JSON.stringify({trackIDs: tracks})})
      let result = await getTracksResponse.json()
      console.log("getTracksTest result", result)
    }

    useEffect(() => {
        setMounted(true)
      }, [])
    return (
      <div className="subreddit-info-container">
        <Image
          className="album-cover"
          roundedCircle
          src={props.albumCover}
          width="256px"
          height="256px"
        />
        <div className="subreddit-title">
          <h1>{"r/" + subID}</h1>
          <div>
            <a href={"https://www.reddit.com/r/" + subID} target="_blank">
              View on Reddit
            </a>
            <LaunchIcon
              style={{ height: "18px", width: "18px", paddingBottom: "3px" }}
            />
          </div>
          <div>
            <Provider store={store}>
              <SubredditPlaylistOptionsButton playlist={props.playlist} subID={subID}/>
            </Provider>
            <button onClick={getTracksTest}>getTracksTest</button>
          </div>
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
  const { height, width } = useWindowDimensions();
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
          ? <div className="sidebar" style={{
            backgroundColor: "#EAECEF",
            width: "14%",
            flexDirection: "column",
            alignItems: "center",
          }}></div>           
          : <Sidebar user={user}></Sidebar>}
        <div className="main-page">
          {isEmpty(user) ? <div></div> : <CustomNavbar user={user} />}

          <div className="page-body">
            {playlist == undefined ? (
              <div></div>
            ) : (
              <SubredditInfo albumCover={playlist["pictureURL"]} playlist={playlist} />
            )}
            {playlist == undefined ? (
              <div></div>
            ) : (
              <Provider store={store}>
                <SubredditTableList playlist={playlist}/>
              </Provider>
              // <div></div>
              // <Tablelist playlist={playlist} />

            )}
          </div>
        </div>
        <Provider store={store}>
          <AudioPlayerBarContainer />
        </Provider>
        {/* ; */}
        <style>
          {`.page-body{
            margin-top: 30px;
            margin-bottom: 100px;
            display:flex;
            flex-direction:column;
            justify-content:nowrap;
            align-items:center;
            
            overflow-y: scroll;
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
  );
};

Subreddit.getInitialProps = async ({ req, query }) => {
  const cookies = parseCookies(req);
  // const router = useRouter();
  const subID: string = query["subID"].toString();
  const res = await fetch(server+"/api/subredditPlaylist/" + subID, {
        method: "GET",
      });
  let result = await res.json();

  return {
    userSession: {
      session_id: cookies.session_id,
      email: cookies.email,
    },
    playlist: result
  };
};

export default Subreddit;
