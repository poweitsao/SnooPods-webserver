import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';

export default function DeleteButton(props) {
    const { handleClick, height, width } = props;
    return (
        <div style={{width: width, height: height}}>
            <button className="delete-button" onClick={() => handleClick()}>
                <DeleteIcon />
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
