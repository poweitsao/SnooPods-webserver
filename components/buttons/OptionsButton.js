import React from "react";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

export default function OptionsButton(props) {
    const { handleClick, height, width } = props;
    return (
        <div style={{width: width, height: height}}>
            <button className="options-button" onClick={() => handleClick()}>
                <MoreHorizIcon />
            </button>
            <style>
                {`
        .options-button {
          padding: 0px;
          width: fit-content;
          background-color: transparent;
          border: none;
        }`}
            </style>
        </div>
    );
}
