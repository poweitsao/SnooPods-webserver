import React from 'react';

function Song(props) {
  const { songName, songArtist } = props;

  return (
    <div>
      <div className="song">
        <p className="song__title">{songName}</p>
        <p className="song__artist">{songArtist}</p>
      </div>
      <style>
        {`
      .song {
        user-select: none;
        margin: 0 20px;
      }
      .song__title {
        text-align: left;
        margin: 0;
        color: black;
        font-weight: normal;
        font-size: 12;
  
        
      }
  
      .song__artist {
        margin: 0;
        color: black;
        font-weight: normal;
        font-size: 12;
      }

      `}
      </style>
    </div>
  )
}

export default Song;