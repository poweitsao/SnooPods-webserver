import React, { Component, useState } from 'react';
import { Navbar, Nav } from "react-bootstrap"
import Audio from "./custom-audio-player/src/Audio"
import useSwr from 'swr'

// const retrievePodcast = async (subreddit, podcast) => {
//     console.log("retrieving podcast")
//     console.log("subreddit: ", subreddit)
//     console.log("podcast: ", podcast)

//     // const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json())

//     if (subreddit && podcast) {
//         // console.log(subreddit)
//         // const { data, error } = useSwr('/api/podcasts/' + subreddit + '/' + podcast, fetcher, { revalidateOnMount: true })
//         const res = await fetch('/api/podcasts/' + subreddit + '/' + podcast, { method: "GET" })
//         const { cloud_storage_url, filename } = await res.json()
//         // if (cloud_storage_url) {
//         //     console.log(error)
//         // }
//         // if (!data) {
//         //     console.log("No data")
//         //     // return (<div>Loading... </div>);
//         // }
//         console.log("storage_url found: ", cloud_storage_url)
//         return cloud_storage_url
//         // return (
//         //     <ReactAudioPlayer src={data.cloud_storage_url} controls={true} autoPlay={false} />

//         // <audio controls={true} autoPlay={false} name="media" src={data.cloud_storage_url} type="audio/mpeg"></audio>

//         // );
//     }
//     // return (<div>Click the button to play a podcast!</div>);
// }


class AudioPlayerBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { src: "", subreddit: "", podcast: "" }
    }
    async componentDidUpdate(prevState) {
        // console.log(this.state)
        // if (prevState.currSrc !== this.props.src) {
        //     this.setState((state) => {
        //         return { currSrc: state.src, src: state.src, subreddit: state.subreddit, podcast: state.podcast }
        //     })
        // }

        if (prevState.subreddit !== this.props.subreddit || prevState.podcast !== this.props.podcast || prevState.src !== this.props.src) {
            this.setState((state) => {
                // console.log("setting state: ", this.props)
                // console.log("url: ", url)
                return { currSrc: state.currSrc, src: this.props.src, subreddit: this.props.subreddit, podcast: this.props.podcast }
            })
        }

    }

    // componentDidMount() {
    //     // console.log("this.state.subreddit: ", this.state.subreddit)
    //     // console.log("props.subreddit: ", this.props.subreddit)
    //     // if (this.state.subreddit !== this.props.subreddit || this.state.podcast !== this.props.podcast)
    //     //     this.setState((props) => {
    //     //         console.log("setting state: ", props)
    //     //         return { subreddit: props.subreddit, podcast: props.podcast }
    //     //     })
    //     // this.setState(async (props) => {
    //     //     console.log("setting state: ", props)
    //     //     let url = await retrievePodcast(props.subreddit, props.podcast)
    //     //     return { cloud_storage_url: url }
    //     // })
    // }

    render() {
        // console.log("state: ", this.state)
        return (

            <div>
                <Navbar bg="light" fixed="bottom" >
                    {/* <Nav><p>{this.state.cloud_storage_url}</p></Nav> */}

                    {/* <Nav.Link href="#home">Home</Nav.Link> */}
                    {/* {console.log("big state: ", this.state.src)} */}
                    {this.state.src

                        // ? <div style={{ padding: "50px" }}></div>
                        // ? <div className="audio-placeholder"><p>HELLO THERE</p></div>
                        ? <Audio src={this.state.src} songName={this.state.podcast} songArtist={this.state.subreddit} />
                        // : <div className="placeholder"></div>
                        : <div style={{ paddingTop: "84px" }}></div>
                    }

                </Navbar>

            </div>


        )
    }

}

export default AudioPlayerBar