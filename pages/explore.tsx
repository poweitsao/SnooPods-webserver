import Layout from "../components/layout"
import ExploreNavbar from "../components/navbar/ExploreNavbar"
import MusicPlayer from "../components/musicPlayer"
import PlayableTile from "../components/PlayableTile"
import { server } from '../config';
import React, { useState, useEffect } from 'react';
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import Cookie, { set } from "js-cookie"
import validateSession from "../lib/validateUserSessionOnPage"
import { Grid } from '@material-ui/core';
import AudioPlayerBar from "../components/AudioPlayerBar"
import fetch from "isomorphic-unfetch"
import isEmpty from "../lib/isEmptyObject"
import LoginPopup from "../components/LoginPopup"
import Sidebar from "../components/sidebar/Sidebar"
import useSWR from 'swr'
import store from "../redux/store";
import AudioPlayerBarContainer from "../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import { getQueue } from "../lib/syncQueue";

import { UserSession } from "../ts/interfaces"
import CategoryGridMenu from "../components/CategoryGridMenu";
import SubredditGridMenu from "../components/SubredditGridMenu";
import EmptySideBar from "../components/sidebar/EmptySideBar";
import useWindowDimensions from "../components/hooks/useWindowDimensions"

import SimpleBarReact from 'simplebar-react';
import "simplebar/src/simplebar.css";


const FeaturedTile = (props) => {
  return (
    <div>
      <div className="featured-tile-container">
        <button className="featured-button"
          onClick={() => {
            Router.push("/subreddit/" + props.subredditInfo.subredditName)
          }}>

          <div className="featured-tile">
            <div className="featured-tile-overlay">
              <div style={{ padding: "10px" }}>{"r/" + props.subredditInfo.subredditName}</div>
            </div>
            <img className="featured-tile-img" src=""></img>
          </div>
        </button>


      </div>
      <style>{`
            .featured-tile-container{
                width:170px;
                height:170px;

                display:flex;
                justify-content:center;
                border: 2px solid white;
                border-radius: 10px;

            }
            .featured-button{
              padding:unset;
              width: 100%;
              border: none;
              text-align: center;
              text-decoration: none;
              transition-duration: 0.4s;
              cursor: pointer;
              background-color: Transparent;
              background-repeat:no-repeat;
              overflow: hidden;
              outline:none;

            }
            .featured-tile-img{
                max-width:100%;
                max-height:100%;
                opacity:1;
            }
            .featured-tile{
                display:flex;
                justify-content:center;
            }
            .featured-tile-overlay{
                position: absolute;
                align-self:center;
                color:black;
                word-break: break-all;
                padding: 10px;
            }
      `}</style>
    </div>)
}

const FeaturedGridMenu = (props) => {

  const [mounted, setMounted] = useState(false)
  const { data } = useSWR(mounted ? "/api/podcasts/getFeatured/" : null)
  const { data: endpoint3 } = useSWR(mounted ? "/api/subredditPlaylist/cscareerquestions" : null)
  // console.log(mounted)
  // console.log("endpoint3.2", endpoint3)

  // const { data } = useSWR( '/api/data' : null, fetchData)

  useEffect(() => {
    setMounted(true)
  }, [])

  const subreddits = []
  if (mounted) {
    // console.log("data", data)
    if (!data) return <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingBottom: "30px" }} key={"loading"}>loading...</div>

    for (const [index, value] of data._keys.entries()) {
      subreddits.push(<div key={index} className={"card-container"}><FeaturedTile subredditInfo={data[value]} /></div>
      )
    }
  }





  return (
    <div >
      <Grid container spacing={3} justify={"center"}>
        {subreddits}
      </Grid>  <style>{`
    
    .card-container{
      padding: 10px;
      display: flex;
      justify-content:center;
    }
    `}</style>
    </div>)
}

const Explore = ({ userSession }) => {

  const [subreddit, setSubreddit] = useState("")
  const [podcast, setPodcast] = useState("")
  const [featuredSubreddits, setFeaturedSubreddits] = useState({})
  const [user, setUser] = useState({})
  const [podcastURL, setPodcastURL] = useState("")
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  const [mounted, setMounted] = useState(false)
  const [searchResult, setSearchResult] = useState({ "categories": [], "subreddits": [] })
  const [categories, setCategories] = useState<Array<any>>([])
  const [searchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    const validateUserSession = async (session_id: string, email: string) => {
      let userSession: UserSession = await validateSession(session_id, email);
      if (userSession.validSession) {
        // console.log("user from validateUserSession", userSession)
        setUser(userSession)

        store.dispatch({
          type: "STORE_USER_SESSION_INFO",
          userSession
        })

      } else {
        Router.push("/")
      }
    }

    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", store.getState().userSessionInfo)
      if (!store.getState().userSessionInfo.validSession) {
        validateUserSession(userSession.session_id, userSession.email);
      } else {
        console.log("not validating user session because it's already valid")
        setUser(store.getState().userSessionInfo)
      }


    } else {
      setShowLoginPopup(true)
    }

    const getAllCategories = async () => {
      if (categories.length == 0) {
        let response = await fetch("/api/search/getAll", { method: "GET" })
        let categories = await response.json()
        console.log("all categories", categories)
        categories.categories.sort((a, b) => {
          var keyA = a.subreddits.length
          var keyB = b.subreddits.length
          if (keyA > keyB) return -1;
          if (keyA < keyB) return 1;
          return 0
        })
        setCategories(categories.categories)
      }
    }
    getAllCategories()

    if (userSession.email) {
      getQueue(userSession.email)
    }

    const delayDebounceFn = setTimeout(() => {
      console.log(searchTerm)
      // Send Axios request here
      search()
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm]);

  const search = async () => {

    if (searchTerm) {
      let searchQueryResponse = await fetch("/api/search/search",
        { method: "POST", body: JSON.stringify({ query: searchTerm }) }
      )
      let searchQueryResult = await searchQueryResponse.json()
      console.log("searchQueryResult", searchQueryResult)
      // setSearchResult(searchQueryResult)
      if (searchQueryResult.subreddits.length > 0) {
        searchQueryResult.categories.push({
          categoryName: "Individual Subreddits",
          categoryID: "123",
          subreddits: searchQueryResult.subreddits
        })
      }
      setCategories(searchQueryResult.categories)
    } else if (searchTerm == "") {
      setSearchResult({ "categories": [], "subreddits": [] })

    }
  }

  const SubredditTile = (props) => {
    const { width } = useWindowDimensions();
    const tileSideLength = width * 0.079

    const colors = ["linear-gradient(to top, #fa7f9e, #54a8d2)",
      "linear-gradient(to top, #0e69f7, #542089)",
      "linear-gradient(to top, #178bdc, #c266d2)"]
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    return (

      <div key={props.subredditName} className="featured-tile-container"
        style={{
          marginRight: props.marginRight,
          width: tileSideLength,
          height: tileSideLength,
          maxHeight: "152px",
          maxWidth: "152px"
        }}>
        <button style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          border: "none",
          padding: "unset",

        }}
          onClick={() => {
            Router.push("/subreddit/" + props.subredditName)
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: randomColor,
              display: "flex",
              borderRadius: "5px"
            }}>
            <div className="tile-name"
              style={{
                padding: "10px",
                width: "100%",
                height: "100%",
                wordWrap: "break-word",
                color: "white",
                textAlign: "center"
              }}>
              {"r/" + props.subredditName}
            </div>
          </div>
        </button>
      </div>
    )
  }

  const CategorySubreddits = ({ subreddits }) => {
    const { height, width } = useWindowDimensions();
    const tileSideLength = width * 0.079
    let items = []
    for (var i = 0; i < subreddits.length; i++) {
      if (i == subreddits.length - 1) {
        items.push(<SubredditTile key={i} subredditName={subreddits[i]} marginRight={"0%"} />)
      } else {
        items.push(<SubredditTile key={i} subredditName={subreddits[i]} marginRight={"2.4%"} />)
      }
    }
    return (
      <div style={{ display: "flex", height: tileSideLength, maxHeight: "152px", maxWidth: "1468px" }}>
        {items}
      </div>
    )
  }

  const LongSubredditTile = (props) => {
    const { height, width } = useWindowDimensions();
    const smallTileSideLength = width * 0.079

    const colors = ["linear-gradient(to bottom, #178bdc, #c266d2)"]
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    return (

      <div
        className="featured-tile-container"
        style={{
          marginRight: props.marginRight,
          width: smallTileSideLength * 2.21,
          height: smallTileSideLength * 1.184,
          maxHeight: "180px",
          maxWidth: "336px"
        }}
      >
        <button style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          border: "none",
          padding: "unset",

        }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: randomColor,
              display: "flex",
              borderRadius: "5px"
            }}>
            <div
              style={{
                padding: "10px",
                width: "100%",
                height: "100%",
                wordWrap: "break-word",
                color: "white",
                fontSize: "1vw",
                textAlign: "center"
              }}>
            </div>
          </div>
        </button>
      </div>
    )
  }

  const TopSubreddits = () => {
    const { height, width } = useWindowDimensions();
    const tileHeight = width * 0.079 * 1.184

    return (
      <div
        className="category-container"
        style={{
          width: "88.6%",
          marginLeft: "auto",
          marginRight: "auto",
          maxHeight: "232px",
          maxWidth: "1468px",
        }}>
        <p
          className="category-name"
          style={{
            color: "white",
            fontFamily: "Roboto",
            fontWeight: 500,
            margin: "unset",
            marginBottom: "min(2.19%, 32px)",
            maxHeight: "20px",
          }}
        >
          Top Subreddits
        </p>
        <div
          style={{ display: "flex", height: tileHeight, maxHeight: "180px" }}
        >
          <LongSubredditTile marginRight={"2.7%"} />
          <LongSubredditTile marginRight={"2.7%"} />
          <LongSubredditTile marginRight={"2.7%"} />
          <LongSubredditTile marginRight={"0%"} />
        </div>
      </div>
    );
  }


  const renderExplorePage = (category, index) => {
    console.log("category", category)

    return (
      <div className="category-container" 
          key={category.categoryName} 
          style={{ width: "88.6%", marginLeft: "auto", marginRight: "auto", maxWidth: "1468px" }}>
        <p className="category-name"
          style={{
            color: "white",
            fontFamily: "Roboto",
            fontWeight: 500,
            margin: "unset",
            marginBottom: "min(2.19%, 32px)",
            maxHeight: "20px"
          }}
        >{category.categoryName}</p>

        <CategorySubreddits subreddits={category.subreddits} />
      </div>
    )
  }
  return (

    <Layout>
      <div>
        <LoginPopup
          show={showLoginPopup}
          onHide={() => {
            setShowLoginPopup(false);
            Router.push("/")

          }} />
      </div>
      <div className="page-container">
        {!user["validSession"]
          ? <EmptySideBar />
          : <Sidebar user={user}></Sidebar>
        }

        <div className="main-page" style={{ backgroundColor: "#121538" }}>
          {!user["validSession"]
            ? <div></div>
            : <ExploreNavbar user={user} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
          }

          <SimpleBarReact style={{ height: "91.3%" }}>
            <div className="search-container" style={{ height: "100%", marginTop: "min(7.93vh, 100px)" }} >
              {categories.length == 0
                ? <div></div>
                : <div style={{ height: "100%", width: "100%" }}>
                  <TopSubreddits />
                  {categories.map(renderExplorePage)}
                  <div style={{ height: "5%" }}>
                  </div></div>}
            </div>
          </SimpleBarReact>

          <style>{`
            .heading{
              text-align:center;
            }
            .main-page{
              width: 100%;
              height: 100%;
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
            .search-container{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .search-result-category{
                padding-top: 10px;
                padding-bottom: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .category-name{
              font-size: min(1.25vw, 24px);
            }
            .category-container{
              margin-bottom: min(4.85%, 80px);
            }
            .tile-name{
              font-size: min(1vw, 18px)
            }
          `}</style>
        </div>
      </div>
      
        <Provider store={store}>
          <AudioPlayerBarContainer />
        </Provider>
      
    </Layout >

  )
}

Explore.getInitialProps = async ({ req }) => {
  const cookies = parseCookies(req)

  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    }
  };
}

export default Explore