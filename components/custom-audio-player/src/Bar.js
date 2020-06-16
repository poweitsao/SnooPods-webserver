import React from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

export default function Bar(props) {
  const { duration, curTime, onTimeUpdate } = props;

  const curPercentage = (curTime / duration) * 100;

  function formatDuration(duration) {
    return moment
      .duration(duration, "seconds")
      .format("mm:ss", { trim: false });
  }

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    const bar = document.querySelector(".bar__progress");
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e) {
    onTimeUpdate(calcClickedTime(e));

    const updateTimeOnMove = eMove => {
      onTimeUpdate(calcClickedTime(eMove));
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  }

  return (
    <div>
      <div className="bar">
        <span className="bar__time">{formatDuration(curTime)}</span>
        <div
          className="bar__progress"
          style={{
            background: `linear-gradient(to right, orange ${curPercentage}%, black 0)`
          }}
          onMouseDown={e => handleTimeDrag(e)}
        >
          <span
            className="bar__progress__knob"
            style={{ left: `${curPercentage - 2}%` }}
          />
        </div>
        <span className="bar__time">{formatDuration(duration)}</span>
      </div>
      <style>
        {`
        .bar {
          user-select: none;
          width: 100%;
          display: flex;
          justify-content:space-around;
          align-items: center;
        }
        .bar__time {
          color: black;
          font-size: 16px;
          padding: 10px;
        }
    
        .bar__progress {
          flex: 1;
          border-radius: 5px;
          width: 100px;
          height: 10px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .bar__progress__knob {
          position: relative;
          height: 16px;
          width: 16px;
          border: 1.5px solid black;
          border-radius: 50%;
          background-color: orange;
        }
      `}
      </style>
    </div>
  );
}
