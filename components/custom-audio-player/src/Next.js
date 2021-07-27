import React from "react";
import {useState} from "react"
import { SvgIcon } from "@material-ui/core";
import NextTrackIcon from "../../../resources/icons/bottom/next_track/next_track.svg";
import NextTrackIconOnClick from "../../../resources/icons/bottom/next_track/next_track_onclick.svg";



export default function Next(props) {
    const { handleClick } = props;
    const [color, setColor] = useState("#5182BE")
    return (
        <div>
            <button className="SkipNext_button" 
                onClick={() => handleClick()}
                onMouseDown={() => setColor("#4CADC7")}
                onMouseUp={() => setColor("#5182BE")}
            >
                {/* <SkipNext style={{color: color}}/> */}
                <SvgIcon
                    viewBox="0 0 34 23"
                    component={NextTrackIcon}
                    style={{ fill: "none", color: color }}
                />
            </button>
            <style>
                {`
        .SkipNext_button {
          width: fit-content;
          background-color: transparent;
          border: none;
          padding-left: 40px;
        }`}
            </style>
        </div>
    );
}
