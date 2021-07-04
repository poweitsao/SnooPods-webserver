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
import useWindowDimensions from "../components/hooks/useWindowDimensions"

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
    const { height, width } = useWindowDimensions();
    const popularSubsHeight = height * 0.6289
    return(
      <div style={{ width: popularSubsHeight * 1.064, height: popularSubsHeight, backgroundColor: "white" }} >
        <div className="popular-subreddits" style={{ height: "50.5%", width: "100%", backgroundColor: "black"}} ></div>
        <div className="recently-played-subreddits" style={{ height: "39.4%", width: "100%", marginTop: "10.1%", backgroundColor: "black"}}></div>
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

          <div className="page-container" >
            <LeftPanel/>
            <div>
              <div className="currently-playing"></div>
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