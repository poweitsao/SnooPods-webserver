import React from 'react';
import { Navbar } from "react-bootstrap"
import Audio from "./custom-audio-player/src/Audio"
import useSwr from 'swr'


class AudioPlayerBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { src: "", subreddit: "", podcast: "" }
    }

    async componentDidUpdate(prevState) {
        if (prevState.subreddit !== this.props.subreddit || prevState.podcast !== this.props.podcast || prevState.src !== this.props.src) {
            this.setState((state) => {
                return { currSrc: state.currSrc, src: this.props.src, subreddit: this.props.subreddit, podcast: this.props.podcast }
            })
        }
    }

    render() {
        return (

            <div>
                <Navbar bg="light" fixed="bottom" >
                    {this.state.src
                        ? <Audio src={this.state.src} trackName={this.state.podcast} subreddit={this.state.subreddit} />
                        : <div style={{ paddingTop: "84px" }}></div>
                    }
                </Navbar>
            </div>
        )
    }
}

export default AudioPlayerBar