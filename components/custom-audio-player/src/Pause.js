import React from "react";
import { PauseCircleFilled } from "@material-ui/icons";

export default function Play(props) {
  const { handleClick } = props;

  return (
    <div>
      <button className="pause__button" onClick={() => handleClick()}>
        <PauseCircleFilled />
      </button>
      <style>
        {`
        .pause__button {
          width: fit-content;
          background-color: transparent;
          border: none;
          }
      
          svg {
            font-size: 4em;
            color: black;
          }
        }`}
      </style>
    </div>
  );
}
