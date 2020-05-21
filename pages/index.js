import Layout from "../components/layout"
import React, { useState } from 'react';
import MusicPlayer from "../components/musicPlayer"







const Index = () => {
  const [showMe, setShowMe] = useState(false);
  const [subreddit, setSubreddit] = useState("")
  const [podcast, setPodcast] = useState("")

  function toggle() {
    setShowMe(!showMe);
  }

  const clickHandler = () => {
    // console.log(JSON.stringify(res.data))
    setSubreddit("Julie")
    setPodcast("hiJuJu")
  }




  // const handleFetch = (data, error) => {
  //   if (error) console.log(error)
  //   else if (!data) console.log("Loading...")
  //   else setAudioSource(data)
  // }

  // const handleFetch = (subreddit, podcast) => {
  //   firestore.getPodcast(subreddit, podcast)
  // }

  return (
    <Layout>
      <div className="container">
        <div className="heading">
          <h1> Play the Podcast </h1>

        </div>

        <div className="button-container">
          <button type="button" className="btn btn-primary" onClick={() => { clickHandler() }}>Get it</button>
        </div>
        {/* <img className="image" src="http://www.poweitsao.com/images/kenobi.jpg"></img> */}
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
      }
`}</style>
      </div>
    </Layout >

  )
}

export default Index