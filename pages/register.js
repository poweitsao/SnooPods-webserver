import Layout from "../components/layout"
import React, { useState } from 'react';
import MusicPlayer from "../components/musicPlayer"



const register = () => {
  // const [showMe, setShowMe] = useState(false);
  // const [subreddit, setSubreddit] = useState("")
  // const [podcast, setPodcast] = useState("")

  return (
    <Layout>
      <div className="container">
        <div className="heading">
          <h1> Register here, new user! </h1>
          {/* <button type="button" className="btn btn-primary" onClick={() => { clickHandler() }}>Play a podcast</button> */}

        </div>


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
`}</style>
      </div>
    </Layout >

  )
}

export default register