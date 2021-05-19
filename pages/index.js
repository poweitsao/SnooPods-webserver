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
import CustomNavbar from "../components/CustomNavbar"

import { storeUserInfo } from "../redux/actions/index"
import { RegisterStore } from "../redux/store"

const Index = ({ userSession }) => {
  useEffect(() => {
    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", userSession)

      validateSession(userSession.session_id, userSession.email);
    }

  }, []);


  async function onGoogleLoginSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    let response = await fetch("/api/user/" + id_token, { method: "GET" }, { revalidateOnMount: false })
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
        // const store = createStore(userInfoReducer)

        RegisterStore.dispatch(storeUserInfo(res))
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
      <div>
        <CustomNavbar />
        {/* <CustomNavbar /> */}
      </div>
      <div className="page-body">
        <div className="heading">
          <div className="logo">
            {/* <Icon icon={headphonesAlt} width={100} height={100} /> */}
          </div>
          <div style={{ height: "10%" }}></div>
          <h1 style={{ fontSize: 60, fontWeight: "bold", color: "black" }}> SNOOPODS </h1>

        </div>

        <div className="desc">
          <p style={{ fontSize: 20 }}>Listen to your favorite subreddits like never before.</p>
          <p style={{ fontSize: 10 }}>We are currently in our Alpha Version. Stay tuned for more updates!</p>

        </div>
        <div className="button-container">
          <div>
            {/* //? figure out how to make this server side rendering so that login button loads faster */}
            {/* <GoogleLogin
              clientId={CLIENT_ID}
              buttonText="Sign In with Google"
              onSuccess={onGoogleLoginSuccess}
              onFailure={onGoogleLoginFailed}
              cookiePolicy={'single_host_origin'}
            />         */}
          </div>


        </div>
        {/* <img className="image" src="http://www.poweitsao.com/images/kenobi.jpg"></img> */}
        <style>{`
      .page-body{
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
    .heading{
      text-align: center;
    }
    .logo{
      text-align:center;
      margin-bottom: 15px;
    }
    .desc{
      text-align: center;
    }
    .navbar{
      display:flex;
      flex-direction: column;
      align-items: stretch;
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