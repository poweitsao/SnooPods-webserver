import React from 'react';

function Track(props) {
  const { trackName, subreddit } = props;
  console.log("trackname:", trackName)
  console.log("subreddit:", subreddit)


  return (
    <div>
      <div className="track">
        <p className="track__title">{trackName}</p>
        <p className="subreddit">{"r/" + subreddit}</p>
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