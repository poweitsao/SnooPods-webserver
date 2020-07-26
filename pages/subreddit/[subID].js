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


import ListGroup from 'react-bootstrap/ListGroup'
import fetch from "isomorphic-unfetch"

import { Icon, InlineIcon } from '@iconify/react';
import playCircleOutlined from '@iconify/icons-ant-design/play-circle-outlined';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';




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

    // const [AudioPlayerBar, setAudioPlayerBar] = useState(<AudioPlayerBar subreddit={subID} podcast={podcast} src={podcastURL} audio={} />)
    const unlockAudio = async (track) => {
        await track.play();
        track.pause()
        // if (playPromise !== undefined) {
        //     await playPromise

        //     playPromise.then(_ => {
        //         // Automatic playback started!
        //         // Show playing UI.
        //         // We can now safely pause video...
        //         console.log("pausing...")
        //         track.pause();

        //         // setAudio(track)

        //     })
        //         .catch(error => {
        //             // Auto-play was prevented
        //             // Show paused UI.
        //             console.log("pausing...")
        //             track.pause();
        //         });


        // }
    }
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
                <div style={{ padding: "10px", width: "100%", height: "100%" }}>
                    <Icon
                        style={{ padding: "10px", width: "17%", height: "17%" }}
                        icon={playButton}
                        onClick={() => { playPodcast(playlist[trackIndex]) }}
                        onMouseEnter={() => setPlayButton(playCircleFilled)}
                        onMouseLeave={() => setPlayButton(playCircleOutlined)} />
                    {/* <button onClick={() => { console.log(playlist) }}>Play</button> */}
                    {playlist[trackIndex]["filename"]}
                </div>

            </ListGroup.Item>
        )
    }

    const List = ({ playlist }) => (
        <div>
            <ListGroup>
                {playlist["keys"].map(renderTrack)}
                {/* <ListGroup.Item>
                    <button onClick={() => { playPodcast(playlist[playlist["keys"][0]]) }}>Play</button> */}
                {/* <button onClick={() => { console.log(playlist) }}>Play</button> */}

                {/* {playlist[playlist["keys"][0]]["filename"]} */}
                {/* </ListGroup.Item> */}
            </ListGroup>
        </div>
    )

    return (
        <Layout>
            {isEmpty(user)
                ? <div></div>
                : <CustomNavbar user={user} />
            }
            <div className="page-body">
                {isEmpty(playlist)
                    ? <div></div>
                    : <img className="album-cover" src={playlist.album_cover_url}></img>}
                {isEmpty(playlist)
                    ? <div></div>
                    : <List playlist={playlist} />}
            </div>

            <style>
                {`.page-body{
                    margin-top: 100px;
                    margin-bottom: 100px;
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