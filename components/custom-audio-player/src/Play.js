import React from "react";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

export default function Play(props) {
  const { handleClick, width, height, backgroundImage, playIconWidth, playIconColor } = props;

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
          <PlayArrowIcon style={{ color: playIconColor, width: playIconWidth, height: playIconWidth }} />
        </div>
      </button>
    // </div>
  );
}
