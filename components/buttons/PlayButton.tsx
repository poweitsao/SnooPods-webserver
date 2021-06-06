import React, { useState } from "react";
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from "@iconify/react";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";

export default function PlayButton(props) {
    const { handleClick, height, width } = props;
    const [playButton, setPlayButton] = useState(playCircleOutlined);

    return (
        <div style={{width: width, height: height}}>
            <button 
            //   onClick={() => options?.playTrack(track.track_id, index, track, options?.playlistID)}
                onClick={handleClick}
                onMouseEnter={() => setPlayButton(playCircleFilled)}
                onMouseLeave={() => setPlayButton(playCircleOutlined)}
                style={{
                padding: "0px",
                width: "fit-content",
                backgroundColor: "transparent",
                border: "none"

            }}>
            <Icon
              style={{ width: "25px", height: "25px" }}
              icon={playButton}
            />
          </button>
            <style>
                {`
        .delete-button {
          padding: 0px;
          width: fit-content;
          background-color: transparent;
          border: none;
        }`}
            </style>
        </div>
    );
}
