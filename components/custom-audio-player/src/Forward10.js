import React from "react";
import { Forward10 } from "@material-ui/icons";

export default function Forward(props) {
    const { handleClick } = props;

    return (
        <div>
            <button className="forward10__button" onClick={() => handleClick()}>
                <Forward10 />
            </button>
            <style>
                {`
        .forward10__button {
          width: fit-content;
          background-color: transparent;
          border: none;
        }`}
            </style>
        </div>
    );
}
