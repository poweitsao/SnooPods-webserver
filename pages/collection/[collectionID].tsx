
import { Collection, Timestamp, Track, UserSession } from "../../ts/interfaces";
import parseCookies from "../../lib/parseCookies";
import { server } from "../../config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Layout from "../../components/layout"
import { AudioPlayerStore, CollectionStore, QueueStore, UserSessionStore } from "../../redux/store";
import Router from "next/router";
import validateSession from "../../lib/validateUserSessionOnPage";
import { getQueue } from "../../lib/syncQueue";
import { replaceCurrentPlaylist, replaceCurrentTrack } from "../../redux/actions/queueActions";
import { storeAudioPlayerInfo } from "../../redux/actions";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import { Icon } from "@iconify/react";
import formatDuration from "../../lib/formatDuration";
import convertDate from "../../lib/convertDate";
import CollectionsTrackOptionsButton from "../../components/buttons/CollectionsTrackOptionsButton";
import { Table } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import LaunchIcon from "@material-ui/icons/Launch";
import PlaylistOptionsButton from "../../components/buttons/PlaylistOptionsButton";
import AudioPlayerBarContainer from "../../components/containers/AudioPlayerBarContainer";
import { Provider } from "react-redux";
import LoginPopup from "../../components/LoginPopup";
import isEmpty from "../../lib/isEmptyObject";
import Sidebar from "../../components/Sidebar";
import CustomNavbar from "../../components/CustomNavbar";





const CollectionPage = ({ userSession, collectionID }) => {
    const fetcher = (url) => fetch(url).then((r) => r.json());

    const {data: playlist} = useSWR("/api/user/collections/get/" + userSession.email + "/" + collectionID, fetcher)

    const [mounted, setMounted] = useState<Boolean>(false);
    const [user, setUser] = useState<UserSession | {}>({});
    const [showLoginPopup, setShowLoginPopup] = useState<Boolean>(false)


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

    if(playlist){
      console.log("playlist", playlist)
      // return(
      //   <div>playlist got!</div>
      // )
    }




    const playPodcast = (trackKey: string, trackIndex: number,  tracks: Array<Track>, collectionName: string) => {
      console.log("params in playPodcast",trackKey, trackIndex, tracks, collectionName )
      var queuePlaylistTracks = []
      for(var i = trackIndex + 1; i <tracks.length; i++ ){
        queuePlaylistTracks.push(tracks[i])
      }
  
      // console.log("queuePlaylistTracks", queuePlaylistTracks)
      var currStore = QueueStore.getState()
      // console.log("store before dispatch", currStore)
  
      if (queuePlaylistTracks.length > 0){
        var playlistName = collectionName
  
        var queuePlaylist = createQueuePlaylist(queuePlaylistTracks, playlistName)
        // console.log("queuePlaylist", queuePlaylist)
        QueueStore.dispatch(
          replaceCurrentPlaylist(queuePlaylist)
        )
        
      
      
      }
      QueueStore.dispatch(
        replaceCurrentTrack(tracks[trackIndex])
      )
      currStore = QueueStore.getState()
      console.log("currStore after replace ", currStore )
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
  
    const renderTrackOnTable = (track: Track, index: number, tracks: Array<Track>, options?: any) => {
      const [playButton, setPlayButton] = useState(playCircleOutlined);
      // console.log(index)
      return (
        <tr key={index}>
          <td style={{ width: "5%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingLeft: "12px",
              }}
            >
              <button 
                  onClick={() => playPodcast(track.track_id, index, tracks, options.collectionName)}
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
            {track.track_name ? (
              <div className="post-title">
                {track.track_name}
              </div>
            ) : (
              <div className="filename">
                {track.filename}
              </div>
            )}
          </td>
          <td style={{ width: "10%" }}>
            {track.audio_length ? (
              <div style={{display: "flex", alignItems: "center"}}>
                <div className="audio-length">
                  {formatDuration(track.audio_length)}
                </div>
              </div>
            ) : (
              <div className="audio-length-dummy">{"audioLength"}</div>
            )}
          </td>
          <td style={{ width: "15%" }}>
            {track.date_posted ? (
              <div className="date-posted" style={{display: "flex", alignItems: "center"}}>
                {convertDate(track.date_posted)}
                <div style={{padding: "10px"}}><CollectionsTrackOptionsButton trackInfo={track}/></div>
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
  
    const Tablelist = ({ playlist }) => {
      console.log("playlist in Tablelist", playlist)
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
            <tbody>{playlist.tracks.map(
              (track, index, array) => {
                return renderTrackOnTable(track, index, array, {collectionName: playlist.collectionName})
                })}</tbody>
          </Table>
        </div>
      );
    };
  
    const CollectionInfo = (props) => {
      const [mounted, setMounted] = useState(false)
  
  
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
            <PlaylistOptionsButton playlist={props.playlist}/>
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
              <CollectionInfo albumCover="https://img.icons8.com/plasticine/800/000000/list.png" playlist={playlist} />
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
    )
}




CollectionPage.getInitialProps = async ({ req, query }) => {
    const cookies = parseCookies(req);

    const collectionID: string = query["collectionID"].toString();
  
    return {
      userSession: {
        session_id: cookies.session_id,
        email: cookies.email,
      },
      collectionID: collectionID
    };
  };
  
  export default CollectionPage;