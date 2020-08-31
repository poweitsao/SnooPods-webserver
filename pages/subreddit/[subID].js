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

import formatDuration from "../../lib/formatDuration"

import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'

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
    // console.log(playlist)

    const playPodcast = async (trackIndex) => {
        const currStore = AudioPlayerStore.getState()
        var podcast = playlist[trackIndex]
        // console.log("podcast", podcast)
        // console.log("trackIndex", trackIndex)
        // console.table(playlist)

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
                trackName: podcast["post_title"],
                filename: podcast["filename"],
                audio: track,
                url: podcast["cloud_storage_url"],
                playlist: playlist,
                keyIndex: playlist["keys"].indexOf(trackIndex)
            }))

            setAudio(track)
        }

    }

    const convertDate = (dateObject) => {
        var unixTime = new Date(dateObject["_seconds"] * 1000);
        var dateString = unixTime.toDateString()
        return dateString.substring(4, 10) + ", " + dateString.substring(11, 15);
    }

    const renderTrackOnTable = (trackIndex) => {
        const [playButton, setPlayButton] = useState(playCircleOutlined)
        return (
            <tr key={trackIndex}>
                <td style={{ width: "5%" }}>
                    <div style={{ display: "flex", justifyContent: "center", paddingLeft: "12px" }}>
                        <Icon
                            style={{ width: "25px", height: "25px" }}
                            icon={playButton}
                            onClick={() => { playPodcast(trackIndex) }}
                            onMouseEnter={() => setPlayButton(playCircleFilled)}
                            onMouseLeave={() => setPlayButton(playCircleOutlined)} />
                    </div>
                </td>
                <td style={{ width: "60%" }}>
                    {playlist[trackIndex]["post_title"]
                        ? <div className="post-title" >{playlist[trackIndex]["post_title"]}</div>
                        : <div className="filename" >{playlist[trackIndex]["filename"]}</div>}
                </td>
                <td style={{ width: "10%" }}>
                    {playlist[trackIndex]["audio_length"]
                        ? <div className="audio-length" >{formatDuration(playlist[trackIndex]["audio_length"])}</div>
                        : <div className="audio-length-dummy">{"audioLength"}</div>}
                </td>
                <td style={{ width: "15%" }}>
                    {playlist[trackIndex]["date_posted"]
                        ? <div className="date-posted" >{convertDate(playlist[trackIndex]["date_posted"])}</div>
                        : <div className="date-posted-dummy">{"datePosted"}</div>}
                </td>
                {/* {playlist[trackIndex]["post_title"]
                            ? <div style={{}}>{playlist[trackIndex]["post_title"]}</div>
                            : <div style={{}}>{playlist[trackIndex]["filename"]}</div>} */}

                {/* </div> */}
                {/* </div> */}


            </tr>
        )
    }

    const Tablelist = ({ playlist }) => {
        return (
            <div style={{ width: "100%" }}>
                {/* <ListGroup variant="flush"></ListGroup> */}
                <Table responsive hover >
                    {/* <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item> */}
                    <thead>
                        <tr>
                            <td></td>
                            <td>Title</td>
                            <td>Duration</td>
                            <td>Date posted</td>
                        </tr>
                    </thead>
                    <tbody>
                        {playlist["keys"].map(renderTrackOnTable)}
                    </tbody>
                </Table>
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
                    : <Tablelist playlist={playlist} />}
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