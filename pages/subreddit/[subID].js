import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import parseCookies from "../../lib/parseCookies"
import validateSession from "../../lib/validateUserSessionOnPage"
import Router from "next/router"
import Cookie, { set } from "js-cookie"
import Layout from "../../components/layout"
import CustomNavbar from "../../components/CustomNavbar"
import AudioPlayerBar from "../../components/AudioPlayerBar"
import ListGroup from 'react-bootstrap/ListGroup'
import fetch from "isomorphic-unfetch"


function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
}



const Subreddit = ({ userSession }) => {
    const [playlist, setPlaylist] = useState({})
    const [user, setUser] = useState({})
    const [podcast, setPodcast] = useState("")
    const [podcastURL, setPodcastURL] = useState("")


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

    // const retrievePodcast = async (subreddit, podcast) => {
    //     console.log("retrieving podcast")
    //     console.log("subreddit: ", subreddit)
    //     console.log("podcast: ", podcast)
    //     if (subreddit && podcast) {
    //         const res = await fetch('/api/podcasts/' + subreddit + '/' + podcast, { method: "GET" })
    //         const { cloud_storage_url, filename } = await res.json()
    //         console.log("storage_url found: ", cloud_storage_url)
    //         setPodcastURL(cloud_storage_url)
    //         return cloud_storage_url
    //     }
    // }

    const playPodcast = (podcast) => {
        setPodcast(podcast["filename"])
        setPodcastURL(podcast["cloud_storage_url"])

        // retrievePodcast(subID, podcast)
    }

    const List = ({ playlist }) => (
        <div>
            <ListGroup>
                <ListGroup.Item>
                    <button onClick={() => { playPodcast(playlist[playlist["keys"][0]]) }}>Play</button>
                    {/* <button onClick={() => { console.log(playlist) }}>Play</button> */}

                    {playlist[playlist["keys"][0]]["filename"]}
                </ListGroup.Item>
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
                <AudioPlayerBar subreddit={subID} podcast={podcast} src={podcastURL} />
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