import IndexLayout from "../components/IndexLayout"
import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import Router from 'next/router';
import { CLIENT_ID } from "../lib/constants"
import isEmpty from "../lib/isEmptyObject"

import { createStore } from "redux"
import Cookie from "js-cookie"
import parseCookies from "../lib/parseCookies"
import fetch from "isomorphic-unfetch"
import { Icon, InlineIcon } from '@iconify/react';
import headphonesAlt from '@iconify/icons-fa-solid/headphones-alt';
import validateSession from "../lib/validateUserSessionOnPage"
import IndexNavBar from "../components/navbar/IndexNavBar"

import { storeRegisterationInfo } from "../redux/actions/index"
import store from "../redux/store"
import Button from 'react-bootstrap/Button'


const Index = ({ userSession }) => {
  useEffect(() => {
    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", userSession)

      validateSession(userSession.session_id, userSession.email);
    }

  }, []);


  async function onGoogleLoginSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    let response = await fetch("/api/user/verifyGoogleSession/" + id_token, { method: "GET" }, { revalidateOnMount: false })
    if (response.status == 200) {
      let res = await response.json()
      if (res.registered) {
        //store session_id
        Cookie.set("session_id", res.session_id)
        Cookie.set("email", res.verification.payload.email)

        // console.log("Taking user to their homepage")
        Router.push('/home')
      }
      else if (!res.registered) {
        // res.userID = id_token
        // console.log("response in index.js", res)
        // const store = createStore(registerReducer)

        store.dispatch(storeRegisterationInfo(res))
        // console.log("store: ", store.getState())
        // console.log("Taking user to registeration page ")
        Router.push('/register')
      }
    }
    else {
      console.log("Login Failed")
    }
  }

  const onGoogleLoginFailed = (response) => {

  }

  return (
    <IndexLayout>
      <div className="index-nav-bar-container">
        <IndexNavBar />
      </div>
      <div className="page-body">
        <div className="group-one" style={{display: "flex", height: "min(101.74vh, 1282px)", width: "100%"}}>
          <div className="group-one-left" style={{height: "100%", width: "50%", backgroundColor: "#C2C4FC"}}></div>
          <div className="group-one-right" style={{height: "100%", width: "50%", backgroundColor: "#F2F2F2"}}></div>
        </div>

        <div className="group-two" 
          style={{
            display: "flex", 
            justifyContent: 'center',
            alignItems: "center",
            height: "min(47.93vh, 604px)", 
            width: "100%", 
            marginTop: "min(49.66%, 300px)", 
            marginBottom: "min(49.66%, 300px)",
            
          }}>
          <div className="group-two-left" style={{width: "42.09%", height: "100%", display: "flex", alignItems: "center" }}>
            <p 
              style={{
                color: "#0e0e0e", 
                fontFamily: "Roboto", 
                fontWeight: "bold", 
                fontSize: "min(64px, 5.07vh)", 
                width: "69.47%", 
                margin: "unset",
                marginLeft: "17.94%", 
                marginRight: "10.51%", 
                textAlign: "center"
              }}>Add individual tracks to your custom collections</p>
          </div>
          <div className="group-two-right" style={{width: "min(1088px, 57.91%)", height: "min(47.93vh, 100%)", backgroundColor: "gray", borderRadius: "5px", marginRight: "1.25%"}}></div>
        </div>

        {/* <div className="desc" style={{width: "60.93%", height: "17.7%", marginBottom: "32.3%"}}>
          <p style={{ fontSize: "3.75vw", fontFamily: "Inter", fontWeight: "500", margin: "unset", marginBottom: "6.3%"}}>Listen to your favorite subreddits like never before.</p>
          <Button style={{width: "18.8%"}}>GET SNOOPODS FREE</Button>
        </div> */}
        <div className="footer" style={{height: "27%", width: "100%", backgroundColor: "#181727"}}></div>
        <style>{`
      .page-body{
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        height: 94.9%;
      }
      .button-container{
        margin:20px;
        text-align:center;
      }
      .heading{
        text-align: center;
      }
      .logo{
        text-align:center;
        margin-bottom: 15px;
      }
      .desc{
        margin-top: 21.4%;
        margin-bottom: 34%; 
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      .navbar{
        display:flex;
        flex-direction: column;
        align-items: stretch;
      }
      .index-nav-bar-container{
        width: 100%;
        height: 5%;
      }

`}</style>
      </div>
    </IndexLayout >

  )
}
// export async function getStaticProps({ req }) {
//   const cookies = parseCookies(req)
//   const res = await fetch("/api/user/validateSession" + cookies.session_id + "/" + cookies.email, { method: "GET" })
//   console.log(res)

// }

Index.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req)

  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    }
  };
}

export default Index