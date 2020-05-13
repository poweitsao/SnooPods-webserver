import Layout from "../components/layout"
import React, { useState } from 'react';
import MusicPlayer from "../components/musicPlayer"


const Index = () => {
  const [showMe, setShowMe] = useState(false);
  const [audioSource, setAudioSource] = useState("")
  function toggle() {
    setShowMe(!showMe);
  }
  return (
    <Layout>
      <div className="container">
        <div className="heading">
          <h1> Play the Podcast </h1>

        </div>

        <div className="button-container">
          <button type="button" className="btn btn-primary" onClick={() => { setAudioSource("http://www.poweitsao.com/podcasts/podcast.mp3") }}>Get it</button>
        </div>
        {/* <img className="image" src="http://www.poweitsao.com/images/kenobi.jpg"></img> */}
        <div className="musicPlayer">
          <MusicPlayer audioSource={audioSource} />
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