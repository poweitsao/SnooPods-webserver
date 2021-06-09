
import { Collection, Timestamp, Track, UserSession } from "../../ts/interfaces";
import parseCookies from "../../lib/parseCookies";
import { server } from "../../config";
import React, { useEffect, useState } from "react";
import useSWR, { trigger } from "swr";
import Layout from "../../components/layout"
import store from "../../redux/store";
import Router from "next/router";
import validateSession from "../../lib/validateUserSessionOnPage";
import { getQueue } from "../../lib/syncQueue";
import { replaceCurrentPlaylist, replaceCurrentTrack } from "../../redux/actions/queueActions";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import { Icon } from "@iconify/react";
import formatDuration from "../../lib/formatDuration";
import convertDate from "../../lib/convertDate";
import CollectionsTrackOptionsButton from "../../components/buttons/CollectionsTrackOptionsButton";
import { Table } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import LaunchIcon from "@material-ui/icons/Launch";
import CollectionOptionsButton from "../../components/buttons/CollectionOptionsButton";
import AudioPlayerBarContainer from "../../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import LoginPopup from "../../components/LoginPopup";
import isEmpty from "../../lib/isEmptyObject";
import Sidebar from "../../components/sidebar/Sidebar";
import CustomNavbar from "../../components/CustomNavbar";

import EditNameModal from "../../components/EditNameModal"
import EditIcon from '@material-ui/icons/Edit';

import CollectionTableList from "../../components/CollectionTableList"
import EmptySideBar from "../../components/sidebar/emptySideBar";


const CollectionPage = ({ userSession, collectionID }) => {
    const fetcher = (url) => fetch(url).then((r) => r.json());
    const fetchCollectionURL = "/api/user/collections/get/" + userSession.email + "/" + collectionID
    const {data: playlist} = useSWR(fetchCollectionURL, fetcher)

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
      getQueue(userSession.email)
    }, []);

    if(playlist){
      console.log("playlist", playlist)

    }

  
    const CollectionInfo = (props) => {
      const [mounted, setMounted] = useState(false)
      const [show, setShow] = useState(false);
      
      const sendNewName = async (newName: string) => {
        await fetch("/api/user/collections/editCollection", 
          { method: "POST", body: JSON.stringify({
              action:"renameCollection",
              fields: {
                  collectionID: playlist.collectionID,
                  newCollectionName: newName,
                  email: store.getState().userSessionInfo.email
              }
          }) 
        })

        trigger(fetchCollectionURL)
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
            <div style={{display: "flex", alignItems: "center"}}>
              <h1>{props.playlist.collectionName}</h1>
              <button style={{width: "fit-content", backgroundColor: "transparent",border: "none"}}
                      onClick={() => setShow(true)}
              >
                <EditIcon/>
              </button>
            </div>
            <CollectionOptionsButton 
              playlist={props.playlist} 
              collectionID={playlist.collectionID} 
              collectionName={playlist.collectionName}
            />
            <EditNameModal 
              type={"collection"}
              name={props.playlist.collectionName}
              runonsubmit={sendNewName}
              show={show}
              onHide={() => setShow(false)}
              fetchURL={"/api/user/collections/getCollections/"+ store.getState().userSessionInfo.email}
            />
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
          ? <EmptySideBar/> 
          : <Sidebar user={user}></Sidebar>
        }
        <div className="main-page">
          {isEmpty(user) ? <div></div> : <CustomNavbar user={user} />}

          <div className="page-body" id="page-body">
            {playlist == undefined ? (
              <div></div>
            ) : (
              <CollectionInfo albumCover="https://img.icons8.com/plasticine/800/000000/list.png" playlist={playlist} />
            )}
            {playlist == undefined ? (
              <div></div>
            ) : (
              // <Tablelist playlist={playlist} />
              <Provider store={store}>
                <CollectionTableList playlist={playlist}/>
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
    )
}




CollectionPage.getInitialProps = async ({ req, query }) => {
    const cookies = parseCookies(req);

    const collectionID: string = query["collectionID"].toString();
  
    return {
      userSession: {
        session_id: cookies.session_id,
        email: cookies.email,
      },
      collectionID: collectionID
    };
  };
  
  export default CollectionPage;