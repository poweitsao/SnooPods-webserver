import React from "react";
// import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

export default function Pause(props) {
  const { handleClick, width, height, backgroundImage, playIconWidth } = props;

  return (
    // <div         
    //   style={{
    //   width: width,
    //   height: height}}> 
      <button
        className="play__button"
        onClick={() => handleClick()}
        style={{
          width: width,
          height: height,
          backgroundColor: "transparent",
          border: "none",
          padding: "unset",
        }}
      >
        <div
          className="custom-play-button"
          style={{
            flexGrow: "0",
            padding: "50% 50% 50% 50%",
            backgroundImage: backgroundImage,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <PauseIcon style={{ color: "white", width: playIconWidth, height: playIconWidth }} />
        </div>
      </button>
    // </div>
  );
}
