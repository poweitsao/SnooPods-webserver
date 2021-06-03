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
          <Image src={pictureURL} width="60px" height="60px"/>
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
        font-size: 15px;
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
        font-size: 12px;
      }

      `}
      </style>
    </div>
  )
}

export default Track;