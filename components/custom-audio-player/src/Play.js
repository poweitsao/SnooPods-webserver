import React from "react";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

export default function Play(props) {
  const { handleClick } = props;

  return (
    <div>
      <button className="play__button" onClick={() => handleClick()}>
        <div className="custom-play-button">
          <PlayArrowIcon  style={{color:"white"}}/>
        </div>
      </button>
      <style>
        {`
      .play__button {
        width: 36px;
        height: 36px;
        background-color: transparent;
        border: none;
        padding: unset;

      }
      .custom-play-button{
        flex-grow: 0;
          padding: 50% 50% 50% 50%;
        background-image: linear-gradient(to top, #2156d9, #4630a0);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%; 

      } 
      .play-button-container{
        display: flex;
        width: 100%;
        height: 100%;
      }
      `}
      </style>
    </div>
  );
}

const CustomPlayIcon = () => {
  return(
    <div className="play-button-container">
      

      
      <style>{`

      .play-icon{

      }

    `}</style>
  </div>

  )
}