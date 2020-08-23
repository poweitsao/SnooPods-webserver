import Layout from "../components/layout"
import React, { useState, useEffect } from 'react';
import CustomNavbar from "../components/CustomNavbar"
import validateSession from "../lib/validateUserSessionOnPage"

import Cookie from "js-cookie"
import parseCookies from "../lib/parseCookies"
import fetch from "isomorphic-unfetch"

const About = ({ userSession }) => {

    useEffect(() => {
        if (userSession.session_id && userSession.email) {
            // console.log("UserSession: ", userSession)

            validateSession(userSession.session_id, userSession.email);
        }

    }, []);

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
                    <div style={{ height: "10%" }}></div>
                    <h1 style={{ fontSize: 60, fontWeight: "bold", color: "black" }}> ABOUT </h1>

                </div>

                {/* <div className="desc">
                    <p style={{ fontSize: 20 }}>Listen to your favorite subreddits like never before.</p>
                    <p style={{ fontSize: 10 }}>We are currently in our Alpha Version. Stay tuned for more updates!</p>

                </div> */}

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

About.getInitialProps = ({ req }) => {
    const cookies = parseCookies(req)

    return {
        userSession: {
            "session_id": cookies.session_id,
            "email": cookies.email
        }
    };
}

export default About;