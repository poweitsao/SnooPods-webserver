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
import { AudioPlayerStore } from "../../redux/store";
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
  // console.log(server + "/api/subredditPlaylist/" + subID)
//   const data = {}
// const [mounted, setMounted] = useState(false)
// const {data: playlist} = useSWR("/api/subredditPlaylist/test/cscareerquestions")
// const {data: endpoint1} = useSWR("/api/subredditPlaylist/poweitsao@gmail.com")
// const {data: endpoint2} = useSWR("/api/user/collections/getCollections/poweitsao@gmail.com")

// const {data: playlist} = useSWR("/api/user/collections/getCollections/poweitsao@gmail.com")



//   console.log(mounted)
//   console.log("endpoint1", endpoint1)
//   console.log("endpoint2", endpoint2)

// const {data: playlist} = useSWR("/api/subredditPlaylist/cscareerquestions")
const {data: playlist} = useSWR("/api/subredditPlaylist/" + subID, {initialData:subredditPlaylist })
const {data: collections} = useSWR("/api/user/collections/getCollections/poweitsao@gmail.com")


  // console.log("SWRPlaylist", playlist)
  // console.log("collections", collections)



//   if (!data) return <div>loading...</div>
//   let playlist: Collection | undefined = data
//   if (!mounted){
//     let playlist: Collection = { keys: [], tracks: {}, collectionName: "", cover_url: "" };

//   }else{
    

//   }
//   if (error) return <div>failed to load</div>
//   if (!data) return <div>loading...</div>
  // console.log(router.query)
  useEffect(() => {

    setMounted(true);

    const validateUserSession = async (session_id: string, email: string) => {
      let userSession: UserSession = await validateSession(session_id, email);
      if (userSession.validSession){
        console.log("user from validateUserSession", userSession)
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

  

    //   console.log("playlist", playlist)


  const oldplayPodcast = (trackIndex: string) => {
    const currStore = AudioPlayerStore.getState();
    var podcast: Track = playlist["tracks"][trackIndex];

    if (currStore.url === podcast["cloud_storage_url"]) {
      AudioPlayerStore.dispatch(togglePlaying(!currStore.playing));
    } else {
      var track: HTMLAudioElement = new Audio(podcast["cloud_storage_url"]);
      track.setAttribute("id", "audio");

      AudioPlayerStore.dispatch(
        storeAudioPlayerInfo({
          playing: true,
          subreddit: subID,
          trackName: podcast["track_name"],
          filename: podcast["filename"],
          audio: track,
          url: podcast["cloud_storage_url"],
          playlist: playlist,
          keyIndex: playlist["keys"].indexOf(trackIndex),
        })
      );
    }
  };

  const playPodcast = (trackKey: string, trackIndex: number) => {

    // console.log("trackKey", trackKey)
    // console.log("trackIndex", trackIndex)
    // console.log("playlist", playlist)
    // console.log("subID", subID)

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
      
    
      // console.log("store after dispatch", currStore)
      // console.log(playlist.tracks[trackKey])
    
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


    // const currStore = AudioPlayerStore.getState();
    // var podcast: Track = playlist["tracks"][trackIndex];

    // if (currStore.url === podcast["cloud_storage_url"]) {
    //   AudioPlayerStore.dispatch(togglePlaying(!currStore.playing));
    // } else {
    //   var track: HTMLAudioElement = new Audio(podcast["cloud_storage_url"]);
    //   track.setAttribute("id", "audio");

    //   AudioPlayerStore.dispatch(
    //     storeAudioPlayerInfo({
    //       playing: true,
    //       subreddit: subID,
    //       trackName: podcast["track_name"],
    //       filename: podcast["filename"],
    //       audio: track,
    //       url: podcast["cloud_storage_url"],
    //       playlist: playlist,
    //       keyIndex: playlist["keys"].indexOf(trackIndex),
    //     })
    //   );
    // }
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

  const convertDate = (dateObject: Timestamp) => {
    var unixTime: Date = new Date(dateObject["_seconds"] * 1000);
    var dateString: string = unixTime.toDateString();
    return dateString.substring(4, 10) + ", " + dateString.substring(11, 15);
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
              <div style={{padding: "10px"}}><TrackOptionsButton trackInfo={playlist.tracks[trackKey]}/></div>
            </div>
          ) : (
            <div className="date-posted-dummy">{"datePosted"}</div>
          )}
        </td>
        {/* {playlist[trackKey]["track_name"]
                            ? <div style={{}}>{playlist[trackKey]["track_name"]}</div>
                            : <div style={{}}>{playlist[trackKey]["filename"]}</div>} */}

        {/* </div> */}
        {/* </div> */}
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

    // const {data: endpoint3} = useSWR(mounted?"/api/subredditPlaylist/cscareerquestions/":undefined)
    // console.log("endpoint3", endpoint3)

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
              <SubredditInfo albumCover={playlist["cover_url"]} />
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
                height: 100%;
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
          {/* <AudioPlayerBar subreddit={subID} podcast={podcast} src={podcastURL} audio={audio} /> */}
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
