import React from "react";
import { SkipNext } from "@material-ui/icons";

export default function Next(props) {
    const { handleClick } = props;

    return (
        <div>
            <button className="SkipNext_button" onClick={() => handleClick()}>
                <SkipNext style={{color: "white"}}/>
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
