import React from "react";
import { SkipPrevious } from "@material-ui/icons";
import {useState} from "react"

export default function Previous(props) {
    const { handleClick } = props;
    const [color, setColor] = useState("#5182BE")

    return (
        <div>
            <button className="SkipPrev_button" 
                onClick={() => handleClick()}
                onMouseDown={() => setColor("#4CADC7")}
                onMouseUp={() => setColor("#5182BE")}
            >
                <SkipPrevious style={{color: color}}/>
            </button>
            <style>{`
                .SkipPrev_button {
                    width: fit-content;
                    background-color: transparent;
                    border: none;
                    padding-right: 40px;
                }
            `}</style>
        </div>
    );
}
