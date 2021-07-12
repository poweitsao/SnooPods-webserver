import React from 'react';
import { useState } from "react";
import Image from "react-bootstrap/Image";
import useWindowDimensions from '../../hooks/useWindowDimensions';
import processTrackName from '../../../lib/processTrackName';

function Track(props) {
  const {height, width} = useWindowDimensions()
  // const trackImageSideLength = height * 0.0714
  const { trackName, subreddit, pictureURL } = props;

  var displayTrackName = processTrackName(trackName, 60)
  return (
    <div>
      <div className="track">
        <div className="trackImage">
          {pictureURL
            ?<Image src={pictureURL} style={{width: "min(7.14vh, 90px)", height: "min(7.14vh, 90px)"}} />
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
        font-family: Roboto, sans-serif;
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
        font-family: Roboto, sans-serif;
        color: white;
      }

      `}
      </style>
    </div>
  )
}

export default Track;