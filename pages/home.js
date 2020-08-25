import Layout from "../components/layout"
import CustomNavbar from "../components/CustomNavbar"
import MusicPlayer from "../components/musicPlayer"
import PlayableTile from "../components/PlayableTile"

import React, { useState, useEffect } from 'react';
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import Cookie, { set } from "js-cookie"
import store from "../redux/store"
import validateSession from "../lib/validateUserSessionOnPage"
import { Grid } from '@material-ui/core';
import AudioPlayerBar from "../components/AudioPlayerBar"
import fetch from "isomorphic-unfetch"
import isEmpty from "../lib/isEmptyObject"
import LoginPopup from "../components/LoginPopup"

const FeaturedTile = (props) => {
  return (
    <div>
      <div className="featured-tile-container">
        <button className="featured-button"
          onClick={() => {
            Router.push("/subreddit/" + props.category.name)
          }}>

          <div className="featured-tile">
            <div className="featured-tile-overlay">
              <div style={{ padding: "10px" }}>{"r/" + props.category.name}</div>
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
  return (
    <div >
      <Grid container spacing={3} justify={"center"}>
        <div className={"card-container"}>
          {isEmpty(props.featuredSubreddits)
            ? <div></div>
            : <FeaturedTile category={props.featuredSubreddits[props.featuredSubreddits["_keys"][0]]} />}
        </div>
        <div className={"card-container"}>
          {isEmpty(props.featuredSubreddits)
            ? <div></div>
            : <FeaturedTile category={props.featuredSubreddits[props.featuredSubreddits["_keys"][1]]} />}
        </div>

        <div className={"card-container"}>
          {isEmpty(props.featuredSubreddits)
            ? <div></div>
            : <FeaturedTile category={props.featuredSubreddits[props.featuredSubreddits["_keys"][2]]} />}
        </div>

        <div className={"card-container"}>
          {isEmpty(props.featuredSubreddits)
            ? <div></div>
            : <FeaturedTile category={props.featuredSubreddits[props.featuredSubreddits["_keys"][3]]} />}
        </div>

        <div className={"card-container"}>
          {isEmpty(props.featuredSubreddits)
            ? <div></div>
            : <FeaturedTile category={props.featuredSubreddits[props.featuredSubreddits["_keys"][4]]} />}
        </div>

        <div className={"card-container"}>
          {isEmpty(props.featuredSubreddits)
            ? <div></div>
            : <FeaturedTile category={props.featuredSubreddits[props.featuredSubreddits["_keys"][5]]} />}
        </div>

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

  useEffect(() => {
    const validateUserSession = async (session_id, email) => {
      let user = await validateSession(session_id, email);
      setUser(user)
    }
    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", userSession)
      validateUserSession(userSession.session_id, userSession.email);
    } else {
      setShowLoginPopup(true)
    }

    const getFeaturedSubreddits = async () => {
      const res = await fetch("/api/podcasts/getFeatured", { method: "GET" })
      if (res.status === 200) {

        const featured = await res.json()
        // console.log("featured in home: ", featured)
        setFeaturedSubreddits(featured);
      }
    }
    getFeaturedSubreddits();
  }, []);

  return (

    <Layout>
      <div>
        <LoginPopup show={showLoginPopup}
          onHide={() => {
            setShowLoginPopup(false);
            Router.push("/")

          }} />
      </div>
      <div >
        {isEmpty(user)
          ? <div></div>
          : <CustomNavbar user={user} />
        }

      </div>
      <div className="page-body">
        <div className="heading">
          <h1> Featured Subreddits </h1>
        </div>

        <div className="grid-container">
          {featuredSubreddits === {}
            ? <div></div>
            : <FeaturedGridMenu featuredSubreddits={featuredSubreddits} />}
        </div>

        <div className="button-container">
        </div>

        <style>{`
        .heading{
          text-align:center;
        }
      .page-body{
        margin-top:50px;
        margin-bottom:50px;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-content:center;
        align-text:center;
        
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
      <div>

        <AudioPlayerBar subreddit={subreddit} podcast={podcast} src={podcastURL} />

      </div>
    </Layout >

  )
}

home.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req)
  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    }
  };
}

export default home