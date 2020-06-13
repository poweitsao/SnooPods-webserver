import React, { Component, useState } from 'react';
import { Image, Button } from "react-bootstrap"
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';


class PlayableTile extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isShown: false }
    }


    render() {
        return (<div>
            <div className="tile-container">
                <button className="button button1"

                    onClick={() => { console.log("playable tile clicked") }}
                    onMouseEnter={() => this.setState((state) => {
                        return { isShown: !state.isShown };
                    })}
                    onMouseLeave={() => this.setState((state) => {
                        return { isShown: !state.isShown };
                    })}>

                    <div className="tile">

                        {this.state.isShown && (
                            <div className="overlay">
                                <PlayCircleFilledIcon fontSize="large"></PlayCircleFilledIcon>
                            </div>
                        )}
                        <img className="img" src="https://i1.sndcdn.com/artworks-7nmc0L048KDmtv7Q-aSOK7A-t200x200.jpg"></img>
                    </div>
                </button>


            </div>
            <style>{`
                    .tile-container{
                        width:100px;
                        height:100px;

                        display:flex;
                        justify-content:center;
                    }
                    .button{
                        padding:unset;
                        border: none;
                        color: white;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        transition-duration: 0.4s;
                        cursor: pointer;
                    }
                    .img{
                        max-width:100%;
                        max-height:100%;
                        opacity:1;
                    }
                    .tile{
                        display:flex;
                        justify-content:center;
                    }
                    .overlay{
                        position: absolute;
                        align-self:center;
                    }

                `}</style>
        </div>


        )
    }

}

export default PlayableTile