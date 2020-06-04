import Layout from "../components/layout"
import React, { useState, useEffect } from 'react';
import MusicPlayer from "../components/musicPlayer"
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import { GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../lib/constants"
import Cookie from "js-cookie"
import store from "../redux/store"
import validateSession from "../lib/validateUserSessionOnPage"






const home = ({ userSession }) => {

  const [subreddit, setSubreddit] = useState("")
  const [podcast, setPodcast] = useState("")

  useEffect(() => {
    if (userSession.session_id && userSession.email) {
      console.log("UserSession: ", userSession)

      validateSession(userSession.session_id, userSession.email);
    }

  }, []);

  const logout = () => {
    console.log("Logout clicked")
    Cookie.remove("session_id")
    Cookie.remove("email")
    Router.push("/")

  }

  const clickHandler = () => {
    setSubreddit("Julie")
    setPodcast("hiJuJu")
  }
  return (
    <Layout>
      <div className="container">
        <div className="heading">
          <h1> Signed In </h1>
          <button type="button" className="btn btn-primary" onClick={() => { clickHandler() }}>Play a podcast</button>

        </div>

        <div className="musicPlayer">
          <MusicPlayer subreddit={subreddit} podcast={podcast} />
        </div>

        <div className="button-container">
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={logout}
          >
          </GoogleLogout>
        </div>

        <style>{`
      .container{
        margin-top:50px;
        display:flex;
        flex-wrap:wrap;
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
`}</style>
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