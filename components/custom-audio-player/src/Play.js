import React from "react";
import { PlayCircleFilled } from "@material-ui/icons";

export default function Play(props) {
  const { handleClick } = props;

  return (
    <div>
      <button className="play__button" onClick={() => handleClick()}>
        <PlayCircleFilled />
      </button>
      <style>
        {`
      .play__button {
        width: 100%;
        background-color: transparent;
        border: none;
        svg {
          font-size: 4em;
          color: black;
        }
      }`}
      </style>
    </div>
  );
}
