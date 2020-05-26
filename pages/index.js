import Layout from "../components/layout"
import React, { useState } from 'react';
import MusicPlayer from "../components/musicPlayer"
// import GoogleBtn from "../components/GoogleBtn"
import GoogleLogin from 'react-google-login';
import Router from 'next/router';
import { CLIENT_ID } from "../constants"

const Index = () => {


  async function onGoogleLoginSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    let response = await fetch("/api/user/" + id_token, { method: "GET" }, { revalidateOnMount: false })
    if (response.status == 200) {
      let res = await response.json()
      console.log(res)
      Router.push('/signedIn')
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