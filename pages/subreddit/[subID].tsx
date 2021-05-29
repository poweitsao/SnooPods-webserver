import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import parseCookies from "../../lib/parseCookies";
import validateSession from "../../lib/validateUserSessionOnPage";
import Router from "next/router";
import Cookie, { set } from "js-cookie";
import Layout from "../../components/layout";
import CustomNavbar from "../../components/CustomNavbar";
import AudioPlayerBar from "../../components/AudioPlayerBar";
import AudioPlayerBarContainer from "../../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import { AudioPlayerStore, CollectionStore } from "../../redux/store";
import { storeAudioPlayerInfo, togglePlaying } from "../../redux/actions/index";
import Image from "react-bootstrap/Image";

import formatDuration from "../../lib/formatDuration";

import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";

import fetch from "isomorphic-unfetch";

import { Icon, IconifyIcon, InlineIcon } from "@iconify/react";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import LaunchIcon from "@material-ui/icons/Launch";
import { Collection, Timestamp, Track, UserSession } from "../../ts/interfaces";
import useWindowDimensions from "../../components/hooks/useWindowDimensions";
import TrackOptionsButton from "../../components/buttons/TrackOptionsButton"

import Sidebar from "../../components/Sidebar";
import useSWR from "swr";
import { server } from "../../config";

import { QueueStore } from "../../redux/store";
import { storeQueueInfo, getQueueInfo, pushNextTrack, replaceCurrentTrack, addPlaylistToQueue, clearCurrentPlaylist, removeTrackFromCurrentPlaylist, removePlaylistFromQueue, removeTrackFromQueue, replaceCurrentPlaylist } from "../../redux/actions/queueActions";
import {syncDB, getQueue} from "../../lib/syncQueue"

import {UserSessionStore} from "../../redux/store"
import LoginPopup from "../../components/LoginPopup";

import PlaylistOptionsButton from "../../components/buttons/PlaylistOptionsButton"
import convertDate from "../../lib/convertDate";

import TrackOptionsButtonContainer from "../../components/containers/TrackOptionsButtonContainer"

function isEmpty(obj: Object) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

const Subreddit = ({ userSession, subredditPlaylist }) => {
  // let emptyPlaylist: Collection = { keys: [], tracks: {}, collectionName: "" , cover_url: ""};
  // const [playlist, setPlaylist] = useState<Collection>(emptyPlaylist);
  const [mounted, setMounted] = useState<Boolean>(false);
  const [user, setUser] = useState<UserSession | {}>({});
  const [showLoginPopup, setShowLoginPopup] = useState<Boolean>(false)

  const router = useRouter();
  const subID: string = router.query["subID"].toString();

  const {data: playlist} = useSWR("/api/subredditPlaylist/" + subID, {initialData:subredditPlaylist })
// const {data: collections} = useSWR("/api/user/collections/getCollections/"+ UserSessionStore.getState().email)
  

  useEffect(() => {

    setMounted(true);

    const validateUserSession = async (session_id: string, email: string) => {
      let userSession: UserSession = await validateSession(session_id, email);
      if (userSession.validSession){
        // console.log("user from validateUserSession", userSession)
        setUser(userSession)
        UserSessionStore.dispatch({
          type:"STORE_USER_SESSION_INFO",
          userSession
        })
      } else{
        Router.push("/")
      }
    }

    if (userSession.session_id && userSession.email) {
      // console.log("UserSession: ", UserSessionStore.getState())
      if (!UserSessionStore.getState().validSession){
        validateUserSession(userSession.session_id, userSession.email);
      } else{
        console.log("not validating user session because it's already valid")
        setUser(UserSessionStore.getState())
      }
      

    } else {
      setShowLoginPopup(true)
    }
    // console.log(data)
    getQueue(userSession.email)



  }, []);
  // console.log(playlist)



  const playPodcast = (trackKey: string, trackIndex: number) => {

    var queuePlaylistTracks = []
    for(var i = trackIndex + 1; i <playlist.keys.length; i++ ){
      queuePlaylistTracks.push(playlist.tracks[playlist.keys[i]])
    }

    // console.log("queuePlaylistTracks", queuePlaylistTracks)
    var currStore = QueueStore.getState()
    // console.log("store before dispatch", currStore)

    if (queuePlaylistTracks.length > 0){
      var playlistName = "r/" + subID

      var queuePlaylist = createQueuePlaylist(queuePlaylistTracks, playlistName)
      // console.log("queuePlaylist", queuePlaylist)
      QueueStore.dispatch(
        replaceCurrentPlaylist(queuePlaylist)
      )
      
    
    
    }
    QueueStore.dispatch(
      replaceCurrentTrack(playlist.tracks[trackKey])
    )
    currStore = QueueStore.getState()
    let currTrack = currStore.QueueInfo.currentTrack
    // syncDB(cookies.email)
    AudioPlayerStore.dispatch(
      storeAudioPlayerInfo({
        playing: true,
        subreddit: "loremipsum",
        trackName: currTrack.track_name,
        filename: currTrack.filename,
        audio: new Audio(currTrack.cloud_storage_url),
        url: currTrack.cloud_storage_url,
        email: UserSessionStore.getState().email}
      )
    )

  };

  const createQueuePlaylist = (tracks: Array<Track>, playlistName: string) => {
    var playlistID = generateID()
    return {
      playlistID: playlistID,
      playlistName: playlistName,
      tracks: tracks
    }

  }

  const generateID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};



  const renderTrackOnTable = (trackKey: string, index: number) => {
    const [playButton, setPlayButton] = useState(playCircleOutlined);
    // console.log(index)
    return (
      <tr key={trackKey}>
        <td style={{ width: "5%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "12px",
            }}
          >
            <button 
                onClick={() => playPodcast(trackKey, index)}
                onMouseEnter={() => setPlayButton(playCircleFilled)}
                onMouseLeave={() => setPlayButton(playCircleOutlined)}
                style={{
                  padding: "0px",
                  width: "fit-content",
                  backgroundColor: "transparent",
                  border: "none"

                  }}>
              <Icon
                style={{ width: "25px", height: "25px" }}
                icon={playButton}
              />
            </button>
          </div>
        </td>
        <td style={{ width: "60%" }}>
          {playlist["tracks"][trackKey]["track_name"] ? (
            <div className="post-title">
              {playlist["tracks"][trackKey]["track_name"]}
            </div>
          ) : (
            <div className="filename">
              {playlist["tracks"][trackKey]["filename"]}
            </div>
          )}
        </td>
        <td style={{ width: "10%" }}>
          {playlist["tracks"][trackKey]["audio_length"] ? (
            <div style={{display: "flex", alignItems: "center"}}>
              <div className="audio-length">
                {formatDuration(playlist["tracks"][trackKey]["audio_length"])}
              </div>
            </div>
          ) : (
            <div className="audio-length-dummy">{"audioLength"}</div>
          )}
        </td>
        <td style={{ width: "15%" }}>
          {playlist["tracks"][trackKey]["date_posted"] ? (
            <div className="date-posted" style={{display: "flex", alignItems: "center"}}>
              {convertDate(playlist["tracks"][trackKey]["date_posted"])}
              <div style={{padding: "10px"}}>
                <Provider store={CollectionStore}>
                  <TrackOptionsButtonContainer trackInfo={playlist.tracks[trackKey]}/>
                </Provider>

                {/* <TrackOptionsButton /> */}
                </div>
            </div>
          ) : (
            <div className="date-posted-dummy">{"datePosted"}</div>
          )}
        </td>

        <style>{`
          .table td{
            padding: 10px;
            vertical-align: unset;
          }
        `}</style>
      </tr>
    );
  };

  const Tablelist = ({ playlist }: { playlist: Collection }) => {
    return (
      <div style={{ width: "100%" }}>
        {/* <ListGroup variant="flush"></ListGroup> */}
        <Table responsive hover>
          {/* <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item> */}
          <thead>
            <tr>
              <td></td>
              <td>Title</td>
              <td>Duration</td>
              <td>Date posted</td>
            </tr>
          </thead>
          <tbody>{playlist["keys"].map(renderTrackOnTable)}</tbody>
        </Table>
      </div>
    );
  };

  const SubredditInfo = (props) => {
    const [mounted, setMounted] = useState(false)
    var playlist = props.playlist
    playlist.collectionName = "r/" + subID

    useEffect(() => {
        setMounted(true)
      }, [])
    return (
      <div className="subreddit-info-container">
        <Image
          className="album-cover"
          roundedCircle
          src={props.albumCover}
          width="256px"
          height="256px"
        />
        <div className="subreddit-title">
          <h1>{"r/" + subID}</h1>
          <div>
            <a href={"https://www.reddit.com/r/" + subID} target="_blank">
              View on Reddit
            </a>
            <LaunchIcon
              style={{ height: "18px", width: "18px", paddingBottom: "3px" }}
            />
          </div>
          <div>
            <PlaylistOptionsButton playlist={props.playlist} subID={subID}/>
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
    );
  };
  const { height, width } = useWindowDimensions();
  return (
    <Layout>
      <div>
        <LoginPopup show={showLoginPopup}
          onHide={() => {
            setShowLoginPopup(false);
            Router.push("/")
          }} />
      </div>
      <div className="page-container">
        {isEmpty(user) ? <div></div> : <Sidebar user={user}></Sidebar>}
        <div className="main-page">
          {isEmpty(user) ? <div></div> : <CustomNavbar user={user} />}

          <div className="page-body">
            {playlist == undefined ? (
              <div></div>
            ) : (
              <SubredditInfo albumCover={playlist["cover_url"]} playlist={playlist} />
            )}
            {playlist == undefined ? (
              <div></div>
            ) : (
              <Tablelist playlist={playlist} />
            )}
          </div>
        </div>
        <Provider store={AudioPlayerStore}>
          <AudioPlayerBarContainer />
        </Provider>
        {/* ; */}
        <style>
          {`.page-body{
            margin-top: 30px;
            margin-bottom: 100px;
            display:flex;
            flex-direction:column;
            justify-content:nowrap;
            align-items:center;
            
            overflow-y: scroll;
            }
            .main-page{
                width: 88%;
                margin-top:30px;
                margin-bottom:30px;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-content:center;
                align-text:center;
                align-self: flex-start;
                height: 95%;
            }

            .page-container{
                display: flex;
                height: 100%
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
        <div>
        </div>
      </div>
    </Layout>
  );
};

Subreddit.getInitialProps = async ({ req, query }) => {
  const cookies = parseCookies(req);
  // const router = useRouter();
  const subID: string = query["subID"].toString();
  const res = await fetch(server+"/api/subredditPlaylist/" + subID, {
        method: "GET",
      });
  let result: Collection = await res.json();

  return {
    userSession: {
      session_id: cookies.session_id,
      email: cookies.email,
    },
    subredditPlaylist: result
  };
};

export default Subreddit;
