import React from "react";
import {useState} from "react"
import { SvgIcon } from "@material-ui/core";
import PrevTrackIcon from "../../../resources/icons/bottom/previous_track/previous_track.svg";
import PrevTrackIconOnClick from "../../../resources/icons/bottom/previous_track/previous_track_onclick.svg";


export default function Previous(props) {
    const { handleClick } = props;
    const [color, setColor] = useState("#5182BE")

    return (
        <div>
            <button className="SkipPrev_button" 
                onClick={() => handleClick()}
                onMouseDown={() => setColor("#4CADC7")}
                onMouseUp={() => setColor("#5182BE")}
            >
                <SvgIcon
                    viewBox="0 0 34 23"
                    component={PrevTrackIcon}
                    style={{ fill: "none", color: color }}
                />
            </button>
            <style>{`
                .SkipPrev_button {
                    width: fit-content;
                    background-color: transparent;
                    border: none;
                    padding-right: 40px;
                }
            `}</style>
        </div>
    );
}
