import Layout from "../components/layout"
import CustomNavbar from "../components/CustomNavbar"
import MusicPlayer from "../components/musicPlayer"
import PlayableTile from "../components/PlayableTile"
import { server } from '../config';
import React, { useState, useEffect } from 'react';
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import Cookie, { set } from "js-cookie"
import validateSession from "../lib/validateUserSessionOnPage"
import { Grid } from '@material-ui/core';
import AudioPlayerBar from "../components/AudioPlayerBar"
import fetch from "isomorphic-unfetch"
import isEmpty from "../lib/isEmptyObject"
import LoginPopup from "../components/LoginPopup"
import Sidebar from "../components/sidebar/Sidebar"
import useSWR from 'swr'
import store from "../redux/store";
import AudioPlayerBarContainer from "../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import {getQueue} from "../lib/syncQueue";

import {UserSession} from "../ts/interfaces"
import EmptySideBar from "../components/sidebar/emptySideBar";



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

const FeaturedGridMenu = (props) => {

  const [mounted, setMounted] = useState(false)
  const {data} = useSWR(mounted ? "/api/podcasts/getFeatured/": null)
  const {data: endpoint3} = useSWR(mounted?"/api/subredditPlaylist/cscareerquestions":null)
  // console.log(mounted)
  // console.log("endpoint3.2", endpoint3)

  // const { data } = useSWR( '/api/data' : null, fetchData)

  useEffect(() => {
    setMounted(true)
  }, [])

  const subreddits = []
  if(mounted){
    // console.log("data", data)
    if (!data) return <div>loading...</div>
    for (const [index, value] of data._keys.entries()) {
      subreddits.push(<div key={index} className={"card-container"}><FeaturedTile subredditInfo={data[value]} /></div>
      )
    }
  }

  

  
  
  return (
    <div >
      <Grid container spacing={3} justify={"center"}>
        {subreddits}
      </Grid>  <style>{`
    
    .card-container{
      padding: 10px;
      display: flex;
      justify-content:center;
    }
    `}</style>
    </div>)
}

const home = ({ userSession }) => {

  const [subreddit, setSubreddit] = useState("")
  const [podcast, setPodcast] = useState("")
  const [featuredSubreddits, setFeaturedSubreddits] = useState({})
  const [user, setUser] = useState({})
  const [podcastURL, setPodcastURL] = useState("")
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  const [mounted, setMounted] = useState(false)

  const {data: endpoint2} = useSWR("/api/user/collections/getCollections/poweitsao@gmail.com")
  // console.log(mounted)
  // console.log("endpoint2", endpoint2)

  const {data: endpoint3} = useSWR("/api/subredditPlaylist/cscareerquestions")
  // console.log(mounted)
  // console.log("endpoint3.1", endpoint3)  

  useEffect(() => {
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

   
    // console.log("usersessionstore", )
    
    setMounted(true)

    getQueue(userSession.email)
    
  }, []);

  const getQueueStore = () =>{
    let queueInfo = store.getState().queueInfo;
    console.log(queueInfo)
  }
  const getUserSessionStore = () =>{
    let UserSessionInfo = store.getState().userSessionInfo
    console.log(UserSessionInfo)
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
            ? <EmptySideBar/>
            : <Sidebar user={user}></Sidebar>
          }
         
        
        <div className="main-page">
          {!user["validSession"]
            ? <div></div>
            : <CustomNavbar user={user} />
          }
          
        
          <div className="heading">
            <h1> Featured Subreddits </h1>
          </div>

          <div className="grid-container">
            {featuredSubreddits === {}
              ? <div></div>
              : <FeaturedGridMenu featuredSubreddits={featuredSubreddits} />}
          </div>

          {/* <div className="button-container">
            <button onClick={getQueueStore}>get queueStore</button>
            <button onClick={() => {console.log("user", user)}}>get user</button>
          </div> */}

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

        <Provider store={store}>
          <AudioPlayerBarContainer />
        </Provider>
        </div>
      
    </Layout >

  )
}

home.getInitialProps = async ({ req }) => {
  // console.log("req", req)
  const cookies = parseCookies(req)

  // const res = await fetch(server + "/api/podcasts/getFeatured", { method: "GET" })
  //   if (res.status === 200) {

  //     var featured = await res.json()
  //     console.log("featured in home: ", featured)
  //     // setFeaturedSubreddits(featured);
  //   } else{
  //     var featured = {} 
  //   }

  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    }
    // featured: data,
    // revalidate: 60 //seconds
  };
}

export default home