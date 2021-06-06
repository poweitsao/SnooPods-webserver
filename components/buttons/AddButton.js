import React from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function Replay(props) {
    const { handleClick } = props;

    return (
        <div>
            <button className="add-button" onClick={() => handleClick()}>
                <AddCircleIcon />
            </button>
            <style>
                {`
        .add-button {
          width: fit-content;
          background-color: transparent;
          border: none;
        }`}
            </style>
        </div>
    );
}
