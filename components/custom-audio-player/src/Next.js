import React from "react";
import { SkipNext } from "@material-ui/icons";
import {useState} from "react"

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
                <SkipNext style={{color: color}}/>
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
