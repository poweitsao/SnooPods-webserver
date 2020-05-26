import Layout from "../components/layout"
import React, { useState } from 'react';
import MusicPlayer from "../components/musicPlayer"



const signedIn = () => {
  // const [showMe, setShowMe] = useState(false);
  const [subreddit, setSubreddit] = useState("")
  const [podcast, setPodcast] = useState("")

  const clickHandler = () => {
    // console.log(JSON.stringify(res.data))
    setSubreddit("Julie")
    setPodcast("hiJuJu")
  }
  return (
    <Layout>
      <div className="container">
        <div className="heading">
          <h1> Signed In </h1>
          <button type="button" className="btn btn-primary" onClick={() => { clickHandler() }}>Play a podcast</button>

        </div>

        <div className="musicPlayer">
          <MusicPlayer subreddit={subreddit} podcast={podcast} />
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

export default signedIn