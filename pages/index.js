import IndexLayout from "../components/IndexLayout";
import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import Router from "next/router";
import { CLIENT_ID } from "../lib/constants";
import isEmpty from "../lib/isEmptyObject";

import { createStore } from "redux";
import Cookie from "js-cookie";
import parseCookies from "../lib/parseCookies";
import fetch from "isomorphic-unfetch";
import { Icon, InlineIcon } from "@iconify/react";
import headphonesAlt from "@iconify/icons-fa-solid/headphones-alt";
import validateSession from "../lib/validateUserSessionOnPage";
import IndexNavBar from "../components/navbar/IndexNavBar";

import { storeRegisterationInfo } from "../redux/actions/index";
import store from "../redux/store";
import Button from "react-bootstrap/Button";
// import headphonesImage from "../public/headphones.jpg";
import Image from "next/image";

const Index = ({ userSession }) => {
  useEffect(() => {
    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", userSession)

      validateSession(userSession.session_id, userSession.email);
    }
  }, []);

  async function onGoogleLoginSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    let response = await fetch(
      "/api/user/verifyGoogleSession/" + id_token,
      { method: "GET" },
      { revalidateOnMount: false }
    );
    if (response.status == 200) {
      let res = await response.json();
      if (res.registered) {
        //store session_id
        Cookie.set("session_id", res.session_id);
        Cookie.set("email", res.verification.payload.email);

        // console.log("Taking user to their homepage")
        Router.push("/home");
      } else if (!res.registered) {
        // res.userID = id_token
        // console.log("response in index.js", res)
        // const store = createStore(registerReducer)

        store.dispatch(storeRegisterationInfo(res));
        // console.log("store: ", store.getState())
        // console.log("Taking user to registeration page ")
        Router.push("/register");
      }
    } else {
      console.log("Login Failed");
    }
  }

  const onGoogleLoginFailed = (response) => {};

  return (
    <IndexLayout>
      <div className="index-nav-bar-container">
        <IndexNavBar />
      </div>
      <div className="page-body">
        <div
          className="group-one"
          style={{
            display: "flex",
            height: "min(101.74vh, 1282px)",
            width: "100%",
          }}
        >
          <div
            className="group-one-left"
            style={{ height: "100%", width: "50%", backgroundColor: "#C2C4FC" }}
          ></div>
          <div
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              top: "50%",
              left: "0",
              right: "0",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontWeight: "bold" }}>
              Listen to your favorite subreddits like never before.
            </h1>
          </div>
          {/* <Image src={headphonesImage} /> */}
          {/* <img src="../public/headphones.jpg"></img> */}
          <div
            className="group-one-right"
            style={{ height: "100%", width: "50%", backgroundColor: "#F2F2F2" }}
          ></div>
        </div>

        {/* <div
          className="group-two"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "min(47.93vh, 604px)",
            width: "100%",
            marginTop: "min(49.66%, 300px)",
            marginBottom: "min(49.66%, 300px)",
          }}
        >
          <div
            className="group-two-left"
            style={{
              width: "42.09%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
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
                textAlign: "center",
              }}
            >
              Add individual tracks to your custom collections
            </p>
          </div>
          <div
            className="group-two-right"
            style={{
              width: "min(1088px, 57.91%)",
              height: "min(47.93vh, 100%)",
              backgroundColor: "gray",
              borderRadius: "5px",
              marginRight: "1.25%",
            }}
          ></div>
        </div> */}

        <div
          className="group-three"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "71.14vw",
            maxWidth: "1366px",
            height: "min(130px, 10.31vh)",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "min(15.87vh, 200px)",
          }}
        >
          <div className="group-three-left" style={{ width: "33.33%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "min(3.17vh, 40px)",
                  fontFamily: "Lato",
                  fontWeight: 900,
                }}
              >
                100+ Podcasts
              </p>
              <p
                style={{
                  fontSize: "min(1.9vh, 24px)",
                  fontFamily: "Lato",
                  fontWeight: 900,
                }}
              >
                From Top Subreddits
              </p>
            </div>
          </div>
          <div
            className="group-three-divider"
            style={{
              width: "5px",
              height: "67.69%",
              backgroundColor: "#aab0f0",
            }}
          ></div>
          <div className="group-three-mid" style={{ width: "33.33%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "min(3.17vh, 40px)",
                  fontFamily: "Lato",
                  fontWeight: 900,
                }}
              >
                Over 2000 Tracks
              </p>
              <p
                style={{
                  fontSize: "min(1.9vh, 24px)",
                  fontFamily: "Lato",
                  fontWeight: 900,
                }}
              >
                Per Topic
              </p>
            </div>
          </div>
          <div
            className="group-three-divider"
            style={{
              width: "5px",
              height: "67.69%",
              backgroundColor: "#aab0f0",
            }}
          ></div>
          <div className="group-three-right" style={{ width: "33.33%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "min(3.17vh, 40px)",
                  fontFamily: "Lato",
                  fontWeight: 900,
                }}
              >
                2+ Minutes
              </p>
              <p
                style={{
                  fontSize: "min(1.9vh, 24px)",
                  fontFamily: "Lato",
                  fontWeight: 900,
                }}
              >
                Of Content Per Track
              </p>
            </div>
          </div>
        </div>

        {/* <div
          className="group-four"
          style={{
            display: "flex",
            width: "min(1378px, 71.77vw)",
            marginTop: "min(15.87vh, 200px)",
            marginBottom: "min(23.8vh, 300px)",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            className="group-four-left"
            style={{
              width: "48.62%",
              textAlign: "center",
              marginRight: "22.27%",
            }}
          >
            <p
              style={{
                fontSize: "min(64px, 3.33vw)",
                fontFamily: "Roboto",
                fontWeight: "bold",
              }}
            >
              Access your favorite tracks instantly.
            </p>
          </div>
          <div
            className="group-four-right"
            style={{
              width: "min(401px, 20.8vw)",
              height: "min(401px, 20.8vw)",
              backgroundColor: "gray",
            }}
          ></div>
        </div> */}

        {/* <div
          className="group-five"
          style={{
            width: "min(83.48vw, 1603px)",
            height: "min(902px, 46.97vw)",
            backgroundColor: "#e0e1e3",
            borderRadius: "10px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        ></div> */}

        <div
          className="group-six"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "37.77vh",
            backgroundColor: "#f2f2f2",
            marginTop: "min(23.8vh, 300px)",
          }}
        >
          <div
            className="group-six-content"
            style={{
              width: "min(79.94%, 1535px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="group-six-content-left"
              style={{
                width: "59.73%",
                textAlign: "center",
                marginRight: "16.4%",
              }}
            >
              <p
                style={{
                  fontSize: "max(40px, min(40px, 3.33vw))",
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                }}
              >
                Queue up different playlists and enjoy them seamlessly.
              </p>
            </div>
            <button
              className="group-six-content-right"
              style={{
                width: "min(303px, 15.7vw)",
                height: "min(70px, 3.6vw)",
                backgroundColor: "#8f72d5",
                borderRadius: "35px",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => Router.push("/home")}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "min(24px, 1.25vw)",
                  fontWeight: "bold",
                  fontFamily: "Roboto",
                  margin: "unset",
                }}
              >
                Get Started
              </p>
            </button>
          </div>
        </div>
        {/* <div
          className="footer"
          style={{ height: "27%", width: "100%", backgroundColor: "#b9bbf8" }}
        ></div> */}
        <style>{`
      .page-body{
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
    </IndexLayout>
  );
};
// export async function getStaticProps({ req }) {
//   const cookies = parseCookies(req)
//   const res = await fetch("/api/user/validateSession" + cookies.session_id + "/" + cookies.email, { method: "GET" })
//   console.log(res)

// }

Index.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req);

  return {
    userSession: {
      session_id: cookies.session_id,
      email: cookies.email,
    },
  };
};

export default Index;
