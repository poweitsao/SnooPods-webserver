import React from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import {useState} from "react"

function calculateCurPercentage(duration, curTime) {
  if (duration && curTime) {
    return (curTime / duration) * 100;
  } else {
    return 0;
  }
}

export default function Bar(props) {
  const { duration, curTime, onTimeUpdate, setSyncBarTimeWithAudio, setCurrentlyScrubbing, currentlyScrubbing } = props;

  const curPercentage = calculateCurPercentage(duration, curTime)
  const [mouseInBar, setMouseInBar] = useState(false)

  const [barLeftColor, setBarLeftColor] = useState("#e8e8e8")
  const [knobSize, setKnobSize] = useState("5px")

  function formatDuration(duration) {
    return moment
      .duration(duration, "seconds")
      .format("mm:ss", { trim: false });
  }

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    // console.log("e.pageX", e.pageX)
    const bar = document.querySelector(".bar__progress");
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar = Math.min(clickPositionInPage, barStart + barWidth) - barStart;
    // console.log("clickPositionInBar", clickPositionInBar)
    // console.log("max", barStart + barWidth)
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

  const mouseUpHandler = () => {
    console.log("mouseup!")
    setCurrentlyScrubbing(false)
    if(!mouseInBar){
      setKnobSize("5px")
      setBarLeftColor("#e8e8e8")
    } else{
      setKnobSize("10px")
      setBarLeftColor("#2651D2")
    }
    setSyncBarTimeWithAudio(true)
    removeEventListener('mouseup', mouseUpHandler);
  }

  return (
    <div>
      <div className="bar">
        <span className="bar__time">{formatDuration(curTime)}</span>

        <div
          className="bar__progress"
          style={{
            background: `linear-gradient(to right, ${barLeftColor} ${curPercentage}%, #c4c4c4 0)`
          }}
          onMouseDown={
            e => {
              handleTimeDrag(e)
              setKnobSize("8px")
              setBarLeftColor("#2651D2")
              setCurrentlyScrubbing(true)

          }}
          onMouseUp={
            () => {
              setCurrentlyScrubbing(false)
              if(!mouseInBar){
                setKnobSize("5px")
                setBarLeftColor("#e8e8e8")
              } else{
                setKnobSize("10px")
                setBarLeftColor("#2651D2")
              }
              setSyncBarTimeWithAudio(true)
              // audio.play()
            }
          }

          onMouseEnter={
            () => {
                    setKnobSize("10px")
                    setBarLeftColor("#2651D2")
                    setMouseInBar(true)
                  }
          }
          onMouseLeave={
            () => {
                    if(!currentlyScrubbing){
                      setKnobSize("5px")
                      setBarLeftColor("#e8e8e8")
                    } else{
                      window.addEventListener("mouseup", mouseUpHandler)
                    }
                    setMouseInBar(false)
                  }
          }
        >
          <span
            className="bar__progress__knob"
            style={{ left: `calc(${curPercentage}% - 3.5px)` }}
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
          cursor: default;
        }
        .bar__time {
          color: #c4c4c4;
          font-size: min(0.95vh, 12px);
          padding-left: 15px;
          padding-right: 15px;
          font-family: Roboto, sans-serif;
          cursor: default;
        }

        .bar__progress {
          flex: 1;
          border-radius: 5px;
          width: 100px;
          height: 5px;
          display: flex;
          align-items: center;
          cursor: pointer;
          cursor: default;
        }

        .bar__progress__knob {
          position: relative;
          height: ${knobSize};
          width: ${knobSize};
          border: 0px solid black;
          border-radius: 50%;
          background-color: #e8e8e8;
          cursor: default;
        }
      `}
      </style>
    </div>
  );
}
