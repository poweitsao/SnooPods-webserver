import Layout from "../components/layout"
import React, { useState, useEffect } from 'react';
import MusicPlayer from "../components/musicPlayer"
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import { GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../lib/constants"
import Cookie from "js-cookie"
import store from "../redux/store"
import validateSession from "../lib/validateUserSessionOnPage"
import { Grid, Card, CardActions, CardContent, Typography, Button } from '@material-ui/core';
import CustomNavbar from "../components/CustomNavbar"
// import { Nav, NavDropdown, Form, FormControl } from "react-bootstrap"

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

const FeaturedCard = (props) => (
  <div>
    <Card className={"root"} variant="outlined">
      <CardContent>
        <Typography className={"title"} color="textSecondary" gutterBottom>
          {props.category.name}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
    <style>{`
      .root{
        minWidth: 275;
        padding: 50px;
        display: flex;
        justify-content: center;
      }
      .title{
        fontSize: 14;
      },
      .pos{
        marginBottom: 12;
      }`}</style>
  </div>
)

const FeaturedGridMenu = (props) => (
  // console.log(props)

  <div >
    <Grid container spacing={3} justify={"center"}>
      {/* {console.log("props in featuredGridMenu: ", props.featuredSubreddits)} */}
      {/* 
    } */}
      <div className={"card-container"}>
        {isEmpty(props.featuredSubreddits)
          ? <div></div>
          : <FeaturedCard category={props.featuredSubreddits[props.featuredSubreddits["_keys"][0]]} />}
      </div>
      <div className={"card-container"}>
        {isEmpty(props.featuredSubreddits)
          ? <div></div>
          : <FeaturedCard category={props.featuredSubreddits[props.featuredSubreddits["_keys"][1]]} />}
      </div>

      <div className={"card-container"}>
        {isEmpty(props.featuredSubreddits)
          ? <div></div>
          : <FeaturedCard category={props.featuredSubreddits[props.featuredSubreddits["_keys"][2]]} />}
      </div>

      <div className={"card-container"}>
        {isEmpty(props.featuredSubreddits)
          ? <div></div>
          : <FeaturedCard category={props.featuredSubreddits[props.featuredSubreddits["_keys"][3]]} />}
      </div>

      <div className={"card-container"}>
        {isEmpty(props.featuredSubreddits)
          ? <div></div>
          : <FeaturedCard category={props.featuredSubreddits[props.featuredSubreddits["_keys"][4]]} />}
      </div>

      <div className={"card-container"}>
        {isEmpty(props.featuredSubreddits)
          ? <div></div>
          : <FeaturedCard category={props.featuredSubreddits[props.featuredSubreddits["_keys"][5]]} />}
      </div>

    </Grid>  <style>{`
    
    .card-container{
      padding: 10px;
      display: flex;
      justify-content:center;
    }
  
    `}</style>
  </div>


)



const home = ({ userSession }) => {

  const [subreddit, setSubreddit] = useState("")
  const [podcast, setPodcast] = useState("")
  const [featuredSubreddits, setFeaturedSubreddits] = useState({})
  const [user, setUser] = useState({})




  useEffect(() => {
    const validateUserSession = async (session_id, email) => {
      let user = await validateSession(session_id, email);
      setUser(user)
    }


    // getFeaturedSubreddits()
    // console.log(featuredSubreddits)
    const getFeaturedSubreddits = async () => {
      const res = await fetch("/api/podcasts/getFeatured", { method: "GET" })
      if (res.status === 200) {

        const featured = await res.json()
        // console.log("featured in home: ", featured)
        setFeaturedSubreddits(featured);
      }
    }

    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", userSession)

      validateUserSession(userSession.session_id, userSession.email);

    }

    getFeaturedSubreddits();
  }, []);



  const logout = () => {
    // console.log("Logout clicked")
    Cookie.remove("session_id")
    Cookie.remove("email")
    Router.push("/")

  }

  const clickHandler = () => {
    setSubreddit("Julie")
    setPodcast("hiJuJu")
  }
  return (

    <Layout>
      <div >
        {/* {console.log("user from home before nav: ", user)} */}
        {isEmpty(user)
          ? <div></div>
          : <CustomNavbar user={user} />
        }

      </div>
      <div className="container">

        <div className="heading">
          <h1> Signed In </h1>


          <button type="button" className="btn btn-primary" onClick={() => { clickHandler() }}>Play a podcast</button>

        </div>
        <div className="grid-container">
          {/* {console.log("featured Subreddits: ", featuredSubreddits)} */}
          {featuredSubreddits === {}
            ? <div></div>
            : <FeaturedGridMenu featuredSubreddits={featuredSubreddits} />}
        </div>

        <div className="musicPlayer">
          <MusicPlayer subreddit={subreddit} podcast={podcast} />
        </div>

        <div className="button-container">
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={logout}
          >
          </GoogleLogout>
        </div>

        <style>{`
      .container{
        margin-top:50px;
        
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-content:center;
        align-text:center;
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

home.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req)
  return {
    userSession: {
      "session_id": cookies.session_id,
      "email": cookies.email
    }
  };
}

export default home