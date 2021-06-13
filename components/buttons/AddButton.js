import React from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import PlaylistIcon from "../../resources/icons/left/add_playlist/playlist_icon.svg"
import { SvgIcon } from '@material-ui/core';
import Image from "next/image"
import {server} from "../../config/index"

export default function Replay(props) {
    const { handleClick } = props;

    return (
        
            <button className="add-button" onClick={() => handleClick()}>
                
                {/* <div className="circle-icon">

                    <AddIcon style={{color: "#131538", width: "18px", height: "18px"}} />
                </div> */}
                <SvgIcon component={PlaylistIcon} />

                {/* <Image src={server + "/resources/icons/left/add_playlist/playlist_icon.svg"} height={18} width={18}/> */}

                <style>{`
                    .add-button {
                        width: fit-content;
                        background-color: transparent;
                        border: none;
                    }
                    .circle-icon{
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        background-image: linear-gradient(to top, #2057dc, #492c9a);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      
                    }

                `}</style>
            </button>
            
        
    );
}
