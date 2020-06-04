import Layout from "../components/layout"
import React, { useState, useEffect } from 'react';
import MusicPlayer from "../components/musicPlayer"
import parseCookies from "../parseCookies"
import Router from "next/router"
import { GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../constants"
import Cookie from "js-cookie"
import store from "../redux/store"





const home = ({ userSession }) => {
  // const [showMe, setShowMe] = useState(false);
  const [subreddit, setSubreddit] = useState("")
  const [podcast, setPodcast] = useState("")

  // useEffect(() => {
  //   async function checkSession() {
  //     let res = await fetch("/api/user/validateSession/" + userSession.session_id + "/" + userSession.email, { method: "GET" })
  //     if (res.status === 200) {
  //       let response = res.json()
  //       if (response.validSession) {
  //         Router.push("/home")
  //       } else { Router.push("/") }
  //     }
  //   }

  //   checkSession()
  // }, []);

  useEffect(() => {
    console.log(store.getState())
    if (userSession.session_id && userSession.email) {
      fetch("/api/user/validateSession/" + userSession.session_id + "/" + userSession.email, { method: "GET" }).then((res) => {
        if (res.status === 200) {
          res.json().then((object) => {
            if (object.validSession) {
              Router.push("/home")
            }
            else {
              Router.push("/")
            }
          })
        }
      })
    }

  }, []);

  const logout = () => {
    console.log("Logout clicked")
    Cookie.remove("session_id")
    Cookie.remove("email")
    Router.push("/")

  }

  // const setCookies = () => {
  //   Cookie.set("session_id", "none")
  //   Cookie.set("email", "none")
  //   Router.push("/")
  // }

  const clickHandler = () => {
    // console.log(JSON.stringify(res.data))
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