import React from 'react';
import { useState } from "react";


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

  const { trackName, subreddit } = props;

  var displayTrackName = processTrackName(trackName)
  return (
    <div>
      <div className="track">
        <p className="track__title">{displayTrackName}</p>
        <p className="subreddit">{subreddit}</p>
      </div>
      <style>
        {`
      .track {
        user-select: none;
      }
      .track__title {
        text-align: left;
        margin: 0;
        color: black;
        font-weight: normal;
        font-size: 15px;
  
        
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