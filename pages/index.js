import Layout from "../components/layout"
import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import Router from 'next/router';
import { CLIENT_ID } from "../constants"
import { storeUserInfo } from "../redux/actions/index"
import store from "../redux/store"
import Cookie from "js-cookie"
import parseCookies from "../parseCookies"
import fetch from "isomorphic-unfetch"
import useSwr from 'swr'


const Index = ({ userSession }) => {

  // const [isLogged, setIsLogged] = useState(false)

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
    if (userSession.session_id && userSession.email) {
      console.log("UserSession: ", userSession)
      fetch("/api/user/validateSession/" + userSession.session_id + "/" + userSession.email, { method: "GET" }).then((res) => {
        if (res.status === 200) {
          res.json().then((object) => {
            if (object.validSession) {
              Router.push("/home")
            }
          })
        }
      })
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

        console.log("Taking user to their homepage")
        Router.push('/home')
      }
      else if (!res.registered) {
        // res.userID = id_token
        console.log("response in index.js", res)
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
// export async function getStaticProps({ req }) {
//   const cookies = parseCookies(req)
//   const res = await fetch("/api/user/validateSession" + cookies.session_id + "/" + cookies.email, { method: "GET" })
//   console.log(res)

// }

Index.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req)
  console.log("getInitialProps")
  if (cookies.session_id && cookies.email) {
    console.log("session_id: ", cookies.session_id)
    console.log("email: ", cookies.email)
  }
  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    }
  };
}

export default Index