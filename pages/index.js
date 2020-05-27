import Layout from "../components/layout"
import React, { useState } from 'react';
import MusicPlayer from "../components/musicPlayer"
// import GoogleBtn from "../components/GoogleBtn"
import GoogleLogin from 'react-google-login';
import Router from 'next/router';
import { CLIENT_ID } from "../constants"
import { storeUserInfo } from "../redux/actions/index"

import store from "../redux/store"

const Index = () => {

  async function onGoogleLoginSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    let response = await fetch("/api/user/" + id_token, { method: "GET" }, { revalidateOnMount: false })
    if (response.status == 200) {
      let res = await response.json()
      if (res.registered) {
        console.log("Taking user to their homepage")
        Router.push('/home')
      }
      else if (!res.registered) {
        store.dispatch(storeUserInfo(res))
        // console.log("store: ", store.getState())
        console.log("Taking user to registeration page ")
        Router.push('/register')
      }
    }
    else {
      console.log("Login Failed")
    }
  }


  const onGoogleLoginFailed = (response) => {
    console.log(response);
    Router.push('/signInFailed')

  }



  return (
    <Layout>
      <div className="container">
        <div className="heading">
          <h1> Headphones for Reddit </h1>

        </div>

        <div className="button-container">
          <div>
            {/* //? figure out how to make this server side rendering so that login button loads faster */}
            <GoogleLogin
              clientId={CLIENT_ID}
              buttonText="Login"
              onSuccess={onGoogleLoginSuccess}
              onFailure={onGoogleLoginFailed}
              cookiePolicy={'single_host_origin'}
            />        </div>
        </div>
        {/* <img className="image" src="http://www.poweitsao.com/images/kenobi.jpg"></img> */}
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

`}</style>
      </div>
    </Layout >

  )
}

export default Index