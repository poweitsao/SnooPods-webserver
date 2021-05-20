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

import Sidebar from "../../components/Sidebar";
import useSWR from "swr";
import { server } from "../../config";

function isEmpty(obj: Object) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

const Subreddit = ({ cookies, subredditPlaylist }) => {
  // let emptyPlaylist: Collection = { keys: [], tracks: {}, collectionName: "" , cover_url: ""};
  // const [playlist, setPlaylist] = useState<Collection>(emptyPlaylist);
  const [mounted, setMounted] = useState<Boolean>(false);
  const [user, setUser] = useState<UserSession | {}>({});
  // const [podcast, setPodcast] = useState("")
  // const [podcastURL, setPodcastURL] = useState("")
  // const [audio, setAudio] = useState<HTMLAudioElement|null>(null)

  const router = useRouter();
  const subID: string = router.query["subID"].toString();
  console.log(server + "/api/subredditPlaylist/" + subID)
//   const data = {}
// const [mounted, setMounted] = useState(false)
// const {data: playlist} = useSWR("/api/subredditPlaylist/test/cscareerquestions")
// const {data: endpoint1} = useSWR("/api/subredditPlaylist/poweitsao@gmail.com")
// const {data: endpoint2} = useSWR("/api/user/getCollections/poweitsao@gmail.com")

// const {data: playlist} = useSWR("/api/user/getCollections/poweitsao@gmail.com")



//   console.log(mounted)
//   console.log("endpoint1", endpoint1)
//   console.log("endpoint2", endpoint2)

// const {data: playlist} = useSWR("/api/subredditPlaylist/cscareerquestions")
const {data: playlist} = useSWR("/api/subredditPlaylist/" + subID, {initialData:subredditPlaylist })
  const {data: collections} = useSWR("/api/user/getCollections/poweitsao@gmail.com")


  console.log("SWRPlaylist", playlist)
  console.log("collections", collections)



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
    // const getSubredditPlaylist = async (subID: string) => {
    //   const res = await fetch("/api/subredditPlaylist/" + subID, {
    //     method: "GET",
    //   });
    //   if (res.status === 200) {
    //     const result: Collection = await res.json();
    //     console.log(result);
    //     setPlaylist(result);
    //   }
    // };
    setMounted(true);
    const validateUserSession = async (session_id: string, email: string) => {
      let user: UserSession = await validateSession(session_id, email);
      setUser(user);
    };

    if (cookies.session_id && cookies.email) {
      validateUserSession(cookies.session_id, cookies.email);
      console.log("router.query", router.query);
      if (!isEmpty(router.query)) {
        // getSubredditPlaylist(subID);
      }
    
    }
    // console.log(data)
  }, []);
  // console.log(playlist)

  

    //   console.log("playlist", playlist)


  const playPodcast = (trackIndex: string) => {
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

  const convertDate = (dateObject: Timestamp) => {
    var unixTime: Date = new Date(dateObject["_seconds"] * 1000);
    var dateString: string = unixTime.toDateString();
    return dateString.substring(4, 10) + ", " + dateString.substring(11, 15);
  };

  const renderTrackOnTable = (trackKey: string) => {
    const [playButton, setPlayButton] = useState(playCircleOutlined);
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
            <Icon
              style={{ width: "25px", height: "25px" }}
              icon={playButton}
              onClick={() => playPodcast(trackKey)}
              onMouseEnter={() => setPlayButton(playCircleFilled)}
              onMouseLeave={() => setPlayButton(playCircleOutlined)}
            />
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
            <div className="audio-length">
              {formatDuration(playlist["tracks"][trackKey]["audio_length"])}
            </div>
          ) : (
            <div className="audio-length-dummy">{"audioLength"}</div>
          )}
        </td>
        <td style={{ width: "15%" }}>
          {playlist["tracks"][trackKey]["date_posted"] ? (
            <div className="date-posted">
              {convertDate(playlist["tracks"][trackKey]["date_posted"])}
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
    cookies: {
      session_id: cookies.session_id,
      email: cookies.email,
    },
    subredditPlaylist: result
  };
};

export default Subreddit;
