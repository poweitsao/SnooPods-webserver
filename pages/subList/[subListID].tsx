
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
import { formatDuration } from "../../lib/formatDuration";
import convertDate from "../../lib/convertDate";
import CollectionsTrackOptionsButton from "../../components/buttons/CollectionsTrackOptionsButton";
import { Table } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import LaunchIcon from "@material-ui/icons/Launch";
import PlaylistOptionsButton from "../../components/buttons/PlaylistOptionsButton";
import AudioPlayerBarContainer from "../../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import LoginPopup from "../../components/LoginPopup";
import isEmpty from "../../lib/isEmptyObject";
import Sidebar from "../../components/sidebar/Sidebar";
import CustomNavbar from "../../components/navbar/CustomNavbar";

import EditNameModal from "../../components/EditNameModal"
import EditIcon from '@material-ui/icons/Edit';

import CollectionTableList from "../../components/CollectionTableList"
import CurrentSubList from "../../components/subList/CurrentSubList";

import SubListOptionsButton from "../../components/buttons/SubListOptionsButton"
import EmptySideBar from "../../components/sidebar/EmptySideBar";


const SubListPage = ({ userSession, subListID }) => {
    const fetcher = (url) => fetch(url).then((r) => r.json());
    const fetchCollectionURL = "/api/user/sublists/get/" + userSession.email + "/" + subListID
    var subList
    if(userSession.email){
      const {data} = useSWR(fetchCollectionURL, fetcher)
      subList = data
    }
    
    const [show, setShow] = useState(false)
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
      if(userSession.email){
        getQueue(userSession.email)
      }
    }, []);

    if(subList){
      console.log("playlist", subList)

    }


  
    const SubListInfo = (props) => {
      const [mounted, setMounted] = useState(false)
      
      // const sendNewName = async (newName: string) => {
      //   await fetch("/api/user/collections/editCollection", 
      //     { method: "POST", body: JSON.stringify({
      //         action:"renameCollection",
      //         fields: {
      //             subListID: playlist.subListID,
      //             newCollectionName: newName,
      //             email: store.getState().userSessionInfo.email
      //         }
      //     }) 
      //   })

      //   trigger(fetchCollectionURL)
      // }

      const renameSubList = async ( newSubListName: string) => {
        let email = store.getState().userSessionInfo.email
        await fetch("/api/user/sublists/editSubList", {
            method: "POST", 
            body: JSON.stringify({
                action: "renameSubList",
                fields: {
                    newSubListName: newSubListName, 
                    subListID: subListID, 
                    email: email
                }
        })})
        trigger(fetchCollectionURL)

    }
      useEffect(() => {
          setMounted(true)
        }, [])
      return (
        <div className="sublist-info-container">
          <Image
            className="album-cover"
            roundedCircle
            src={props.albumCover}
            width="256px"
            height="256px"
          />
          <div className="sublist-title">
            <div style={{display: "flex", alignItems: "center"}}>
              <h1>{props.subList.subscriptionListName}</h1>
              <button style={{width: "fit-content", backgroundColor: "transparent",border: "none"}}
                      onClick={() => setShow(true)}
              >
                <EditIcon/>
              </button>
            </div>
            <SubListOptionsButton subList={props.subList}/>
            <EditNameModal 
              type={"mix"}
              name={subList.subscriptionListName}
              runonsubmit={renameSubList}
              show={show}
              onHide={() => setShow(false)}
              fetchURL={"/api/user/sublists/getSubLists/"+ store.getState().userSessionInfo.email}
            />
            
          </div>
          <style>{`
                  .sublist-info-container{
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      padding: 20px;
                  }
                  .sublist-title{
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
          : <Sidebar user={user}></Sidebar>}
        <div className="main-page">
          {isEmpty(user) ? <div></div> : <CustomNavbar user={user} />}

          <div className="page-body">
            {subList == undefined ? (
              <div></div>
            ) : (
              <SubListInfo albumCover="https://img.icons8.com/plasticine/800/000000/horizontal-settings-mixer.png" subList={subList} />
            )}
            {subList == undefined ? (
              <div></div>
            ) : (
              // <Tablelist playlist={playlist} />
              <Provider store={store}>
                {/* <CollectionTableList playlist={playlist}/> */}
                <CurrentSubList subList={subList.collections} subListID={subList.subscriptionListID}/>
              </Provider>
                // <div>SubListTableList</div>
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
              width: 100%;
              height: 100%;
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




SubListPage.getInitialProps = async ({ req, query }) => {
    const cookies = parseCookies(req);

    const subListID: string = query["subListID"].toString();
  
    return {
      userSession: {
        session_id: cookies.session_id,
        email: cookies.email,
      },
      subListID: subListID
    };
  };
  
  export default SubListPage;