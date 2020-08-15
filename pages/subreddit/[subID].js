import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import parseCookies from "../../lib/parseCookies"
import validateSession from "../../lib/validateUserSessionOnPage"
import Router from "next/router"
import Cookie, { set } from "js-cookie"
import Layout from "../../components/layout"
import CustomNavbar from "../../components/CustomNavbar"
import AudioPlayerBar from "../../components/AudioPlayerBar"
import AudioPlayerBarContainer from "../../components/containers/AudioPlayerBarContainer"
import { Provider } from 'react-redux'
import { AudioPlayerStore } from "../../redux/store"
import { storeAudioPlayerInfo, togglePlaying } from "../../redux/actions/index"
import Image from 'react-bootstrap/Image'

import ListGroup from 'react-bootstrap/ListGroup'
import fetch from "isomorphic-unfetch"

import { Icon, InlineIcon } from '@iconify/react';
import playCircleOutlined from '@iconify/icons-ant-design/play-circle-outlined';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';
import LaunchIcon from '@material-ui/icons/Launch';



function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

// var audioElement = {}
// var elementId = "audioElement" + new Date().valueOf().toString();
// var audioElement = document.createElement('audio');
// audioElement.setAttribute("id", elementId);
// document.body.appendChild(audioElement);

const Subreddit = ({ userSession }) => {
    const [playlist, setPlaylist] = useState({})
    const [user, setUser] = useState({})
    const [podcast, setPodcast] = useState("")
    const [podcastURL, setPodcastURL] = useState("")
    const [audio, setAudio] = useState()

    const router = useRouter()
    const { subID } = router.query

    // console.log(router.query)
    useEffect(() => {
        const getSubredditPlaylist = async (subID) => {

            const res = await fetch("/api/subredditPlaylist/" + subID, { method: "GET" })
            if (res.status === 200) {
                const result = await res.json()
                console.log(result)
                setPlaylist(result)
            }
        }

        const validateUserSession = async (session_id, email) => {
            let user = await validateSession(session_id, email);
            setUser(user)
        }

        if (userSession.session_id && userSession.email) {
            validateUserSession(userSession.session_id, userSession.email);

            if (!isEmpty(router.query)) {
                getSubredditPlaylist(subID)
            }
        }


    }, [subID])
    console.log(playlist)

    const playPodcast = async (podcast) => {
        const currStore = AudioPlayerStore.getState()
        if (currStore.url === podcast["cloud_storage_url"]) {
            AudioPlayerStore.dispatch(togglePlaying(!currStore.playing))
        } else {

            setPodcast(podcast["filename"])
            setPodcastURL(podcast["cloud_storage_url"])

            var track = new Audio(podcast["cloud_storage_url"])
            track.setAttribute("id", "audio")
            // var track = document.createElement(audio)

            // var playPromise = await track.play()
            // if (playPromise !== undefined) {
            //     track.pause()
            // }
            // track.play()
            // track.load()
            // track.pause()
            // track.currentTime = 0

            AudioPlayerStore.dispatch(storeAudioPlayerInfo({
                playing: true,
                subreddit: subID,
                trackName: podcast["filename"],
                audio: track,
                url: podcast["cloud_storage_url"]
            }))

            setAudio(track)

            // track.play().catch()
            // track.pause()
            // track.currentTime = 0
            // console.log("track:", track)
            // setAudio(track)
            // setTimeout(() => { track.play() }, 5000);
            // audioElement.play()

            // retrievePodcast(subID, podcast)
        }

    }

    const renderTrack = (trackIndex) => {
        const [playButton, setPlayButton] = useState(playCircleOutlined)
        return (
            <ListGroup.Item key={trackIndex}>
                {/* <button onClick={() => { playPodcast(playlist[trackIndex]) }}>Play</button> */}
                <div style={{ width: "100%" }}>
                    <div style={{ fontSize: "16px", display: "flex", justifyContent: "flex-start" }}>
                        <Icon
                            style={{ width: "25px", height: "25px", marginRight: "20px" }}
                            icon={playButton}
                            onClick={() => { playPodcast(playlist[trackIndex]) }}
                            onMouseEnter={() => setPlayButton(playCircleFilled)}
                            onMouseLeave={() => setPlayButton(playCircleOutlined)} />
                        {/* <button onClick={() => { console.log(playlist) }}>Play</button> */}
                        <div style={{}}>{playlist[trackIndex]["filename"]}</div>
                    </div>
                </div>

            </ListGroup.Item>
        )
    }

    const List = ({ playlist }) => {
        return (
            <div style={{ width: "100%" }}>
                <ListGroup variant="flush"></ListGroup>
                <ListGroup variant="flush">
                    <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item>

                    {playlist["keys"].map(renderTrack)}
                    {/* <ListGroup.Item>
                    <button onClick={() => { playPodcast(playlist[playlist["keys"][0]]) }}>Play</button> */}
                    {/* <button onClick={() => { console.log(playlist) }}>Play</button> */}

                    {/* {playlist[playlist["keys"][0]]["filename"]} */}
                    {/* </ListGroup.Item> */}
                    <ListGroup.Item></ListGroup.Item>
                </ListGroup>
            </div>
        )
    }

    const SubredditInfo = (props) => {
        return (
            <div className="subreddit-info-container">
                <Image className="album-cover" roundedCircle src={props.albumCover} width="256px" height="256px" />
                <div className="subreddit-title">
                    <h1>{"r/" + subID}</h1>
                    <div>
                        <a href={"https://www.reddit.com/r/" + subID} target="_blank">View on Reddit</a>
                        <LaunchIcon style={{ height: "18px", width: "18px", paddingBottom: "3px" }} />
                    </div>
                </div>
                <style>{`
                .subreddit-info-container{
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding: 20px;
                }
                .subreddit-title{
                    padding:20px;
                }
            `}</style>
            </div>
        )
    }

    return (
        <Layout>
            <div>
                {isEmpty(user)
                    ? <div></div>
                    : <CustomNavbar user={user} />
                }
            </div>
            <div className="page-body">
                {isEmpty(playlist)
                    ? <div></div>
                    : <SubredditInfo albumCover={playlist.album_cover_url} />}
                {isEmpty(playlist)
                    ? <div></div>
                    : <List playlist={playlist} />}
            </div>

            <style>
                {`.page-body{
                    margin-top: 30px;
                    margin-bottom: 100px;
                    display:flex;
                    flex-direction:column;
                    justify-content:nowrap;
                    align-items:center;
                    }
                    .album-cover{
                        padding: 20px;
                    }
                    .navbar{
                        display:flex;
                        flex-direction: column;
                        align-items: stretch;
                      }
                `}
            </style>
            <div >
                {/* <AudioPlayerBar subreddit={subID} podcast={podcast} src={podcastURL} audio={audio} /> */}
                <Provider store={AudioPlayerStore}>
                    <AudioPlayerBarContainer />
                </Provider>
            </div>
        </Layout>
    )

}

Subreddit.getInitialProps = ({ req }) => {
    const cookies = parseCookies(req)
    return {
        userSession: {
            "session_id": cookies.session_id,
            "email": cookies.email
        }
    };
}

export default Subreddit