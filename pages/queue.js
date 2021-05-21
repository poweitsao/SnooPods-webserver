import Layout from "../components/layout"
import CustomNavbar from "../components/CustomNavbar"
import React, { useState, useEffect } from 'react';
import validateSession from "../lib/validateUserSessionOnPage"
import isEmpty from "../lib/isEmptyObject"
import Sidebar from "../components/Sidebar"
import { AudioPlayerStore } from "../redux/store";
import AudioPlayerBarContainer from "../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import parseCookies from "../lib/parseCookies"
import fetch from "isomorphic-unfetch"


const Queue = ({ userSession }) => {

    const [user, setUser] = useState({})
    useEffect(() => {
      const validateUserSession = async (session_id, email) => {
        let user = await validateSession(session_id, email);
        console.log(user)
        setUser(user)
      }

      const getQueue = async(email) =>{
          const res = await fetch("/api/queue/getQueue/", {
              method: "POST", body: JSON.stringify({email: email})
            })
            let result = await res.json()
            console.log("getQueue result:", result)
      }

      if (userSession.session_id && userSession.email) {
        // console.log("UserSession: ", userSession)
        validateUserSession(userSession.session_id, userSession.email);
      } 
      getQueue(userSession.email)
    }, []);
  
    return (
  
      <Layout>
        <div className="page-container">
          {isEmpty(user)
              ? <div></div>
              : <Sidebar user={user}></Sidebar>
            }
            <div className="main-page">
                {isEmpty(user)
                    ? <div></div>
                    : <CustomNavbar user={user} />
                }
                <div className="heading">
                    <h1> Queue </h1>
                </div>
    
                <style>{`
                .heading{
                text-align:center;
                }
                .main-page{
                width: 88%;
                margin-top:30px;
                margin-bottom:30px;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-content:center;
                align-text:center;
                align-self: flex-start;
                }
    
            .page-container{
                display: flex;
                height: 100%;
                
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
            .grid-container{
                padding:20px;
                width: 80%;
                display: flex;
                justify-content:center;
                align-self:center;
                margin-right: 50px;
                margin-left:50px;
                max-width: 690px;
            }
            .navbar{
                display:flex;
                flex-direction: column;
                align-items: stretch;
            }
        `}</style>
            </div>
        </div>
        <div>
            <Provider store={AudioPlayerStore}>
                <AudioPlayerBarContainer />
            </Provider>
        </div>
        
      </Layout >
  
    )
  }

  Queue.getInitialProps = async ({ req }) => {
    const cookies = parseCookies(req)
    return {
      userSession: {
        "session_id": cookies.session_id,
        "email": cookies.email
      }
    };
  }
  
  export default Queue