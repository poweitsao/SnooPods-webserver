import React from "react";
import { Replay10 } from "@material-ui/icons";

export default function Replay(props) {
    const { handleClick } = props;

    return (
        <div>
            <button className="replay10_button" onClick={() => handleClick()}>
                <Replay10 />
            </button>
            <style>
                {`
        .replay10_button {
          width: fit-content;
          background-color: transparent;
          border: none;
        }`}
            </style>
        </div>
    );
}
