import React, { Component, useState } from 'react';
import { Navbar, Nav } from "react-bootstrap"
import Audio from "./custom-audio-player/src/Audio"

class AudioPlayerBar extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div>
                <Navbar fixed="bottom" style={{ padding: "unset" }}>
                    {/* <Nav.Link href="#home">Home</Nav.Link> */}
                    <Audio />
                </Navbar>
            </div>


        )
    }

}

export default AudioPlayerBar