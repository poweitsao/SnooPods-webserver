import Layout from "../components/layout"
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
  const user = {}
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
    <Layout>
      <div>
        <CustomNavbar />
        {/* <CustomNavbar /> */}
      </div>
      <div className="page-body">
        <div className="heading">
          <div className="logo">
            {/* <Icon icon={headphonesAlt} width={100} height={100} /> */}
          </div>
          <div style={{ height: "70px" }}></div>
          <h1 style={{ fontSize: 60, fontWeight: "bold", color: "black" }}> SNOOPODS </h1>

        </div>

        <div className="desc">
          <p style={{ fontSize: 20 }}>Listen to your favorite subreddits like never before.</p>
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tristique varius ornare. Mauris auctor arcu euismod, ultricies felis suscipit, malesuada sapien. Fusce a hendrerit mauris. Curabitur rhoncus eget neque sit amet tempus. Pellentesque non fermentum ante. Morbi vel dui ac ipsum lobortis hendrerit ac a urna. Duis ut purus maximus massa sollicitudin vestibulum. Nunc metus nibh, luctus vitae auctor sit amet, pretium ut enim.

Vestibulum sit amet accumsan ex. Praesent sit amet rhoncus ipsum. Integer eleifend mauris vitae dolor laoreet euismod nec vitae dui. Praesent et suscipit ante, et tempus ante. Sed et purus sit amet ligula lobortis bibendum quis ut elit. Nunc finibus velit vitae enim feugiat egestas. Duis sagittis odio sed euismod egestas. Cras id nisi vitae tellus hendrerit faucibus. Mauris a eros sodales, maximus neque nec, tristique quam.

Aenean dolor nisi, venenatis quis mauris interdum, luctus posuere sem. Quisque ut diam pharetra, porta sem et, pharetra est. Ut imperdiet ligula augue, ac hendrerit arcu commodo ac. Cras fermentum, erat in mollis pellentesque, quam diam hendrerit ante, id bibendum diam turpis vitae magna. Maecenas dapibus auctor tortor, id tempus diam finibus ac. Quisque feugiat ultricies pulvinar. Pellentesque ut lectus odio. In hac habitasse platea dictumst. Nam viverra semper justo eu tempus. Morbi ultrices orci porttitor, suscipit nulla non, sagittis tortor. Vivamus vitae volutpat risus, eget imperdiet dolor.

In hac habitasse platea dictumst. Duis aliquam metus ipsum, malesuada commodo magna sagittis at. Nulla aliquam suscipit purus, vel ullamcorper odio dapibus nec. Morbi interdum lacus eu lectus finibus dictum. Etiam placerat est eu felis efficitur, ullamcorper vestibulum sem placerat. Sed blandit scelerisque tellus sodales ornare. Quisque accumsan odio id eros varius accumsan. Maecenas sit amet pellentesque ante. Nunc accumsan vitae orci nec consequat.

Maecenas in vehicula ante. In in dolor urna. Nulla ullamcorper dolor semper tellus eleifend eleifend. Suspendisse id pretium massa, eget imperdiet dolor. Nam purus ante, accumsan vel velit eu, placerat hendrerit felis. Duis luctus efficitur fringilla. Quisque fermentum, dolor at volutpat pellentesque, nibh dui pretium velit, vel malesuada turpis quam non nisi. Mauris tincidunt dapibus mauris eu faucibus. Donec auctor quam fermentum nulla dignissim placerat. Quisque augue lacus, luctus ac sem sagittis, cursus lacinia tellus. Proin cursus, lectus quis viverra porta, lectus metus lacinia metus, ac sollicitudin quam purus sed nisi. Maecenas bibendum facilisis metus, eu fermentum turpis viverra sit amet. Cras leo tellus, pharetra ac ipsum ut, molestie vestibulum purus. Fusce in laoreet tortor. Morbi ultricies est pellentesque ullamcorper scelerisque. Etiam lobortis orci posuere erat euismod aliquet.

Pellentesque sollicitudin dolor sed pellentesque vehicula. Aliquam sit amet augue viverra libero vehicula commodo. Nulla facilisi. Nulla id metus sagittis, ultricies nisl id, imperdiet diam. Donec sed risus id tellus tempus imperdiet vitae eget mi. Mauris id sapien erat. Donec quis ante ut eros vulputate vestibulum. Aenean convallis mauris vitae metus vestibulum commodo.

Aliquam auctor ac risus id congue. Nam sit amet rhoncus justo. Maecenas ligula metus, venenatis quis hendrerit eu, bibendum nec leo. Nunc ut vestibulum lectus, vel consectetur sapien. Nam sem odio, efficitur ornare laoreet at, convallis.
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

  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    }
  };
}

export default Index