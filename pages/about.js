import Layout from "../components/layout"
import React, { useState, useEffect } from 'react';
import CustomNavbar from "../components/CustomNavbar"
import validateSession from "../lib/validateUserSessionOnPage"
import { Image } from "react-bootstrap"

import Cookie from "js-cookie"
import parseCookies from "../lib/parseCookies"
import fetch from "isomorphic-unfetch"

const About = ({ userSession }) => {
  const [user, setUser] = useState({})


  useEffect(() => {
    const validateUserSession = async (session_id, email) => {
      let currUser = await validateSession(session_id, email);
      setUser(currUser)

    }
    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", userSession)
      validateUserSession(userSession.session_id, userSession.email);
    }
  }, []);

  return (
    <Layout>
      <div>
        <CustomNavbar user={user} />
        {/* <CustomNavbar /> */}
      </div>
      <div className="page-body">
        <div className="heading" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div className="logo">
            {/* <Icon icon={headphonesAlt} width={100} height={100} /> */}
          </div>
          <div style={{ height: "10%" }}></div>
          <h1 style={{ fontSize: 60, fontWeight: "bold", color: "black" }}> ABOUT </h1>
          <div className="page-body" style={{ display: "flex", justifyContent: "center", width: "90%", paddingBottom: "30px" }}>
            <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
              <Image style={{ width: "300px", overflow: "hidden" }} thumbnail src="https://storage.googleapis.com/listen-to-reddit-test/images/profile_pic.jpg" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <a href="https://www.linkedin.com/in/poweitsao/" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                <img align="left" alt="linkedin" width="50px"
                  src="https://img.icons8.com/color/1000/000000/linkedin.png" />
              </a>
              <a href="https://www.linkedin.com/in/poweitsao/" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                <img align="left" alt="linkedin" width="50px"
                  src="https://img.icons8.com/fluent/1000/000000/github.png" />
              </a>
            </div>
            <div className="page-body-text" style={{ paddingTop: "20px" }}>
              <h3>Hi! I'm Po, a Software Engineer and a student at UVa.</h3>
              <h5 style={{ textAlign: "center" }}> I am passionate about developing software that can make a positive difference in people's lives.</h5>
              <h5 style={{ textAlign: "left", paddingTop: "30px" }}> SnooPods started as a solution for a minor convenience: I couldn’t browse my favorite subreddits while doing a boring task. I searched the web for a solution but was disappointed with the results. I wondered if there was a way to create Reddit posts as podcasts and allow me to easily listen to them when I am busy with a time-consuming task. While I was exploring the possibility, SnooPods was born.
            </h5>
              <h5 style={{ textAlign: "left", paddingTop: "30px" }}>
                As my idea slowly formed in front of my eyes during development, I realized that SnooPods could serve a purpose much more important than allowing me to browse Reddit and drive at the same time. Many of the visually impaired are missing out on social media interactions in this modern age. After interviewing with some people from this demographic, it seems that their participation in these platforms is very limited, making them feel more alone.
            </h5>
              <h5 style={{ textAlign: "left", paddingTop: "30px" }}>
                While SnooPods is still very early in its development, I hope to create a platform that can allow users to listen to Reddit like a podcast easily. Regardless of whether they are using it to make a boring chore more interesting or rely on it to finally participate in their favorite subreddits, I believe SnooPods can become a platform for everyone.
            </h5>
              <h5 style={{ textAlign: "left", paddingTop: "30px" }}>
                If you have any questions, comments, or suggestions, feel free to email me at <a style={{ color: "#4B6EE0" }} href="mailto:pt5rsx@virginia.edu">pt5rsx@virginia.edu</a>.
            </h5>
            </div>

          </div>
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