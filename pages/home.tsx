import Layout from "../components/layout"
import CustomNavbar from "../components/navbar/CustomNavbar"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import validateSession from "../lib/validateUserSessionOnPage"
import { Grid } from '@material-ui/core';
import LoginPopup from "../components/LoginPopup"
import Sidebar from "../components/sidebar/Sidebar"
import useSWR from 'swr'
import store from "../redux/store";
import AudioPlayerBarContainer from "../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import { getQueue } from "../lib/syncQueue";
import { UserSession } from "../ts/interfaces"
import EmptySideBar from "../components/sidebar/EmptySideBar";
import Image from "react-bootstrap/Image";
import AlbumCoverButton from "../components/AlbumCoverButton";

const FeaturedTile = (props) => {
  return (
    <div>
      <div className="featured-tile-container">
        <button className="featured-button"
          onClick={() => {
            Router.push("/subreddit/" + props.subredditInfo.subredditName)
          }}>

          <div className="featured-tile">
            <div className="featured-tile-overlay">
              <div style={{ padding: "10px" }}>{"r/" + props.subredditInfo.subredditName}</div>
            </div>
            <img className="featured-tile-img" src=""></img>
          </div>
        </button>


      </div>
      <style>{`
            .featured-tile-container{
                width:170px;
                height:170px;

                display:flex;
                justify-content:center;
                border: 2px solid black;
                border-radius: 10px;

            }
            .featured-button{
              padding:unset;
              width: 100%;
              border: none;
              text-align: center;
              text-decoration: none;
              transition-duration: 0.4s;
              cursor: pointer;
              background-color: Transparent;
              background-repeat:no-repeat;
              overflow: hidden;
              outline:none;

            }
            .featured-tile-img{
                max-width:100%;
                max-height:100%;
                opacity:1;
            }
            .featured-tile{
                display:flex;
                justify-content:center;
            }
            .featured-tile-overlay{
                position: absolute;
                align-self:center;
                color:black;
                word-break: break-all;
                padding: 10px;
            }
      `}</style>
    </div>)
}



const Home = ({ userSession }) => {

  const [user, setUser] = useState({})
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  useEffect(() => {
    const validateUserSession = async (session_id: string, email: string) => {
      let userSession: UserSession = await validateSession(session_id, email);
      if (userSession.validSession) {
        setUser(userSession)
        store.dispatch({
          type: "STORE_USER_SESSION_INFO",
          userSession
        })
      } else {
        Router.push("/")
      }
    }

    if (userSession.session_id && userSession.email) {
      if (!store.getState().userSessionInfo.validSession) {
        validateUserSession(userSession.session_id, userSession.email);
      } else {
        console.log("not validating user session because it's already valid")
        setUser(store.getState().userSessionInfo)
      }
    } else {
      setShowLoginPopup(true)
    }

    if (userSession.email) {
      getQueue(userSession.email)
    }
  }, []);

  const LeftPanel = () => {
    return(
      <div style={{ width: "58.1%", height: "100%", marginRight: "auto" }} >
        <div className="popular-subreddits" 
          style={{ height: "50.5%", width: "100%" }} 
        >
          <p style={{height: "13%", width: "100%", fontSize: "min(1.9vh, 24px)", fontFamily: "Roboto", fontWeight: 500, color: "white", margin: "unset"}}>Popular</p>
          <div style={{width: "100%", height: "87%", display: "flex" }}>
            <div style={{width: "77.15%", height: "100%", backgroundImage: "radial-gradient(circle at 0 0, #924ae6, #ae39bf, #b932b0, #a74dc2, #7f88eb, #849de4, #8762ec, #9946de)"}}></div>
            <div style={{width: "22.85%", height: "100%", backgroundImage: "conic-gradient(from 0.25turn, #191bb3, #4362db 0.33turn, #a041c7 0.44turn, #4660dc 0.54turn, #0cacdb 0.94turn, #191bb3)"}}></div>
          </div>
        </div>
        <div className="recently-played-subreddits" 
              style={{ height: "39.4%", width: "100%", marginTop: "10.1%" }}
        >
          <p style={{height: "16.6%", width: "100%", fontSize: "min(1.9vh, 24px)", fontFamily: "Roboto", fontWeight: 500, color: "white", margin: "unset"}}>Recently Played</p>
          <div style={{width: "100%", height: "83.4%", display: "flex", justifyContent: "space-between"}}>
            <AlbumCoverButton src="https://img.icons8.com/fluent/800/000000/image.png" handleClick={() => {}}width="30.8%" height="100%"/>
            <AlbumCoverButton src="https://img.icons8.com/fluent/800/000000/image.png" handleClick={() => {}}width="30.8%" height="100%"/>
            <AlbumCoverButton src="https://img.icons8.com/fluent/800/000000/image.png" handleClick={() => {}}width="30.8%" height="100%"/>
          </div>
        </div>
      </div>
    )
  }

  const RightPanel = () => {
    return(
      <div style={{ width: "35.5%", height: "100%", backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center"}} >
        <div className="current-album" style={{ height: "35.7%", width: "93%", backgroundColor: "black"}} >
        <p style={{height: "18.6%", width: "100%", fontSize: "min(1.9vh, 24px)", fontFamily: "Roboto", fontWeight: 500, color: "white", margin: "unset"}}>Currently Playing</p>
        <div style={{width: "100%", height: "84.1%", backgroundImage: "radial-gradient(circle at 0 0, #5c0fb2, #4018ae, #322dae, #1761aa, #2461aa, #1068a9, #243cab, #5d11ae)"}}></div>
        </div>
        <div className="track-list" style={{ height: "55.1%", width: "100%", marginTop: "auto", backgroundColor: "black"}}></div>
      </div>
    )
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
        {!user["validSession"]
          ? <EmptySideBar />
          : <Sidebar user={user}></Sidebar>
        }


        <div className="main-page">
          {!user["validSession"]
            ? <div></div>
            : <CustomNavbar user={user} />
          }

          <div className="page-container">
            <div className="panel-container">
              <LeftPanel/>
              <RightPanel/>
            </div>
          </div>

          <style>{`
          .heading{
            text-align:center;
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
              height: 100%;
              justify-content: center;
              background-image: linear-gradient(to bottom, #121538, #12102b, #12091a);
            }
            .panel-container{
              display: flex;
              width: min(115.39vh, 1454px);
              height: min(62.89vh, 793px);
              margin-top: min(7.93vh, 100px);
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
        <Provider store={store}>
          <AudioPlayerBarContainer />
        </Provider>
      </div>

    </Layout >

  )
}

Home.getInitialProps = async ({ req }) => {
  const cookies = parseCookies(req)

  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    }
  };
}

export default Home