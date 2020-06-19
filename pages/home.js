import Layout from "../components/layout"
import CustomNavbar from "../components/CustomNavbar"
import MusicPlayer from "../components/musicPlayer"
import PlayableTile from "../components/PlayableTile"
import Audio from "../components/custom-audio-player/src/Audio"

import React, { useState, useEffect } from 'react';
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import { GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../lib/constants"
import Cookie, { set } from "js-cookie"
import store from "../redux/store"
import validateSession from "../lib/validateUserSessionOnPage"
import { Grid, Card, CardActions, CardContent, Typography, Button } from '@material-ui/core';
import AudioPlayerBar from "../components/AudioPlayerBar"
import fetch from "isomorphic-unfetch"

// import { Nav, NavDropdown, Form, FormControl } from "react-bootstrap"

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}



const FeaturedTile = (props) => (

  <div>
    <div className="featured-tile-container">
      <button className="featured-button"
        onClick={() => { console.log("playable tile clicked", props.category.name) }}>

        <div className="featured-tile">

          {/* {this.state.isShown && (
            <div className="overlay">
              <PlayCircleFilledIcon fontSize="large"></PlayCircleFilledIcon>
            </div>
          )} */}
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
  </div>
)

const FeaturedGridMenu = (props) => (

  <div >
    <Grid container spacing={3} justify={"center"}>
      {/* {console.log("props in featuredGridMenu: ", props.featuredSubreddits)} */}
      {/* 
    } */}
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
  </div>


)



const home = ({ userSession }) => {

  const [subreddit, setSubreddit] = useState("")
  const [podcast, setPodcast] = useState("")
  const [featuredSubreddits, setFeaturedSubreddits] = useState({})
  const [user, setUser] = useState({})
  const [podcastURL, setPodcastURL] = useState("")




  useEffect(() => {
    const validateUserSession = async (session_id, email) => {
      let user = await validateSession(session_id, email);
      setUser(user)
    }


    // getFeaturedSubreddits()
    // console.log(featuredSubreddits)
    const getFeaturedSubreddits = async () => {
      const res = await fetch("/api/podcasts/getFeatured", { method: "GET" })
      if (res.status === 200) {

        const featured = await res.json()
        // console.log("featured in home: ", featured)
        setFeaturedSubreddits(featured);
      }
    }

    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", userSession)

      validateUserSession(userSession.session_id, userSession.email);

    }

    getFeaturedSubreddits();
  }, []);



  const logout = () => {
    // console.log("Logout clicked")
    Cookie.remove("session_id")
    Cookie.remove("email")
    Router.push("/")

  }

  const retrievePodcast = async (subreddit, podcast) => {
    console.log("retrieving podcast")
    console.log("subreddit: ", subreddit)
    console.log("podcast: ", podcast)
    if (subreddit && podcast) {
      const res = await fetch('/api/podcasts/' + subreddit + '/' + podcast, { method: "GET" })
      const { cloud_storage_url, filename } = await res.json()
      console.log("storage_url found: ", cloud_storage_url)
      setPodcastURL(cloud_storage_url)
      return cloud_storage_url
    }
  }

  const clickHandler = () => {
    setSubreddit("Julie")
    setPodcast("hiJuJu")
    retrievePodcast("Julie", "hiJuJu").catch((e) => {
      console.log(e)
    })
  }
  const clickHandler2 = () => {
    setSubreddit("jokes")
    setPodcast("jokes-2020-06-03")
    retrievePodcast("jokes", "jokes-2020-06-03")
  }
  return (

    <Layout>
      <div >
        {/* {console.log("user from home before nav: ", user)} */}
        {isEmpty(user)
          ? <div></div>
          : <CustomNavbar user={user} />
        }

      </div>
      <div className="container">

        <div className="heading">
          <h1> Featured Subreddits </h1>
          <button type="button" className="btn btn-primary"
            onClick={() => { clickHandler() }}>Play a podcast</button>
          <button type="button" className="btn btn-primary"
            onClick={() => { clickHandler2() }}>Play another podcast</button>
          {/* <div style={{ padding: "10px", display: "flex", justifyContent: "center" }}>
            <PlayableTile /></div> */}
        </div>


        <div className="grid-container">
          {/* {console.log("featured Subreddits: ", featuredSubreddits)} */}
          {featuredSubreddits === {}
            ? <div></div>
            : <FeaturedGridMenu featuredSubreddits={featuredSubreddits} />}
        </div>

        {/* <div className="musicPlayer">
          <MusicPlayer subreddit={subreddit} podcast={podcast} />
        </div> */}

        <div className="button-container">
        </div>

        <style>{`
        .heading{
          text-align:center;
        }
      .container{
        margin-top:50px;
        
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
        {/* <Audio /> */}
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