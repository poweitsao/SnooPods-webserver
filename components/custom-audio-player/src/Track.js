import React from 'react';
import { useState } from "react";
import Image from "react-bootstrap/Image";


function processTrackName(trackName) {

  if (trackName.length > 60) {
    for (var i = 60; trackName[i] !== " "; i--) {
    }
    return trackName.substring(0, i) + "..."
  } else {
    return trackName
  }
}

function Track(props) {

  const { trackName, subreddit, pictureURL } = props;

  var displayTrackName = processTrackName(trackName)
  return (
    <div>
      <div className="track">
        <div className="trackImage">
          {pictureURL
            ?<Image src={pictureURL} width="90px" height="90px"/>
            : <div></div>}
          
        </div>
        <div className="track-words">
          <p className="track__title">{displayTrackName}</p>
          <p className="subreddit">{subreddit}</p>
        </div>
      </div>
      <style>
        {`
      .track {
        user-select: none;
        display: flex;

      }
      .track__title {
        text-align: left;
        margin: 0;
        color: black;
        font-weight: normal;
        font-size: 11px;
        font-family: 'Roboto', sans-serif;
        color: white;
      }

      .trackImage{
        padding-right: 25px;
      }

      .track-words{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
  
      .subreddit {
        margin: 0;
        color: black;
        font-weight: normal;
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
        color: white;
      }

      `}
      </style>
    </div>
  )
}

export default Track;