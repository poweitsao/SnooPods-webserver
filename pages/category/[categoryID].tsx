import Layout from "../../components/layout"
import CustomNavbar from "../../components/navbar/CustomNavbar"
import MusicPlayer from "../../components/musicPlayer"
import PlayableTile from "../../components/PlayableTile"
import { server } from '../../config';
import React, { useState, useEffect } from 'react';
import parseCookies from "../../lib/parseCookies"
import Router from "next/router"
import Cookie, { set } from "js-cookie"
import validateSession from "../../lib/validateUserSessionOnPage"
import { Grid } from '@material-ui/core';
import AudioPlayerBar from "../../components/AudioPlayerBar"
import fetch from "isomorphic-unfetch"
import isEmpty from "../../lib/isEmptyObject"
import LoginPopup from "../../components/LoginPopup"
import Sidebar from "../../components/sidebar/Sidebar"
import useSWR from 'swr'
import store from "../../redux/store";
import AudioPlayerBarContainer from "../../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import {getQueue} from "../../lib/syncQueue";

import {UserSession} from "../../ts/interfaces"
import SubredditGridMenu from "../../components/SubredditGridMenu"
import EmptySideBar from "../../components/sidebar/EmptySideBar";



const CategoryPage = ({ userSession, categoryID }) => {
  console.log("categoryID", categoryID)
  const [user, setUser] = useState({})
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  const [mounted, setMounted] = useState(false)
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json())
  const {data: categoryData} = useSWR("/api/category/get/" + categoryID, fetcher)


  useEffect(() => {
    const validateUserSession = async (session_id: string, email: string) => {
      let userSession: UserSession = await validateSession(session_id, email);
      if (userSession.validSession){
        // console.log("user from validateUserSession", userSession)
        setUser(userSession)
        
        store.dispatch({
          type:"STORE_USER_SESSION_INFO",
          userSession
        })
        
      } else{
        Router.push("/")
      }
    }

    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", store.getState().userSessionInfo)
      if (!store.getState().userSessionInfo.validSession){
        validateUserSession(userSession.session_id, userSession.email);
      } else{
        console.log("not validating user session because it's already valid")
        setUser(store.getState().userSessionInfo)
      }
      

    } else {
      setShowLoginPopup(true)
    }
    
  }, []);

  // if(!categoryData){
  //   return(
  //     <Layout>
  //     <div>loading...</div>
  //     </Layout>
  //   )
  // }
  console.log(categoryData)
  return (

    <Layout>
      <div>
        <LoginPopup show={showLoginPopup}
          onHide={() => {
            setShowLoginPopup(false);
            Router.push("/")

          }} />
      </div>
      <div className="page-container">
        {!user["validSession"]
            ? <EmptySideBar/>
            : <Sidebar user={user}></Sidebar>
          }
         
        
        <div className="main-page">
          {!user["validSession"]
            ? <div></div>
            : <CustomNavbar user={user} />
          }
          
          {categoryData
            ?(<div>
                <div className="heading">
                  <h1> {categoryData.categoryName} </h1>
                </div>
      
                <div className="grid-container">
                  {categoryData.subreddits.length == 0
                    ? <div></div>
                    : <SubredditGridMenu subreddits={categoryData.subreddits} />}
                </div>
              </div>)
            :<div></div> 
          }


          {/* <div className="search-container">
            <input onChange={(e) => setSearchTerm(e.target.value)}></input>
            <div className="search-result-category">
                <h3>categories</h3>
                {searchResult.categories.map(renderCategorySearchResult)}
            </div>
            <div className="search-result-category">
                <h3>subreddits</h3>
                {searchResult.subreddits.map(renderSubredditSearchResult)}
            </div>
          </div> */}

          {/* <div className="button-container">
            <button onClick={getQueueStore}>get queueStore</button>
            <button onClick={() => {console.log("user", user)}}>get user</button>
          </div> */}

          <style>{`
          .heading{
            text-align:center;
          }
          .main-page{
            width: 86.25%;
            height: 90.5%;
            display:flex;
            flex-direction:column;
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
          display: flex;
          justify-content:center;
          align-self:center;

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

        <Provider store={store}>
          <AudioPlayerBarContainer />
        </Provider>
        </div>
      
    </Layout >

  )
}

CategoryPage.getInitialProps = async ({ req, query }) => {
  // console.log("req", req)
  const cookies = parseCookies(req)

  // const res = await fetch(server + "/api/podcasts/getFeatured", { method: "GET" })
  //   if (res.status === 200) {

  //     var featured = await res.json()
  //     console.log("featured in CategoryPage: ", featured)
  //     // setFeaturedSubreddits(featured);
  //   } else{
  //     var featured = {} 
  //   }
  const categoryID: string = query["categoryID"].toString();
  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    },
    categoryID: categoryID
    // featured: data,
    // revalidate: 60 //seconds
  };
}

export default CategoryPage