import Layout from "../components/layout"
import React, { useState } from 'react';
import MusicPlayer from "../components/musicPlayer"


const signInFailed = () => {

    return (
        <Layout>
            <div className="container">
                <div className="heading">
                    <h1> Sign In Failed! :( </h1>

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

export default signInFailed