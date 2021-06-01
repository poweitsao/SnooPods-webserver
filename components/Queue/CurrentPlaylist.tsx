import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import React, { useEffect, useState } from "react";
import convertDate from "../../lib/convertDate";
import formatDuration from "../../lib/formatDuration";
import isEmpty from "../../lib/isEmptyObject";
import { syncDB, syncQueueWithAudioPlayer } from "../../lib/syncQueue";
import { togglePlaying } from "../../redux/actions";
import { replaceCurrentTrack, removeTrackFromCurrentPlaylist, removeTrackFromQueue, pushNextTrack, clearCurrentPlaylist, removePlaylistFromQueue } from "../../redux/actions/queueActions";
import store from "../../redux/store";
import { Track, QueuePlaylist } from "../../ts/interfaces";
import Icon from "@iconify/react";
import QueuePlaylistOptionsButtonContainer from "../containers/QueuePlaylistOptionsButtonContainer";
import { Table } from "react-bootstrap";
import { connect, Provider } from "react-redux";
import useSWR, { trigger } from "swr";
import PlayButton from "../buttons/PlayButton";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import toggleLike from "../../lib/toggleLike"

const renderTrackOnTable = (track: Track, index: number, array: Array<Track>, options?: any) => {
    // console.log("likedTracks in renderTrackOnTable (CurrentPlaylist)", options.likedTracks)
    return (
      <tr key={options.playlistID + "_" + track.track_id + "_" + index.toString()}>
        <td style={{ width: "5%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "12px",
            }}
          >
            <PlayButton 
              handleClick={() => options?.playTrack(track.track_id, index, track, options?.playlistID)}
              width="25px"
              height="25px"
            />
          </div>
        </td>
        <td style={{ width: "60%" }}>
          {array[index]["track_name"] ? (
            <div className="post-title">
              {array[index]["track_name"]}
            </div>
          ) : (
            <div className="filename">
              {array[index]["filename"]}
            </div>
          )}
        </td>
        <td style={{ width: "5%" }}>
                  <button style={{
                              padding: "0px",
                              width: "fit-content",
                              backgroundColor: "transparent",
                              border: "none"
                          }}
                          onClick={() => toggleLike(track, options.likedTracksCollectionID)}
  
                  >
                      {options.likedTracks.includes(track.track_id)
                          ? <FavoriteIcon/>
                          : <FavoriteBorderIcon/>
                      }
                  </button>
              </td>
        <td style={{ width: "10%" }}>
          {array[index]["audio_length"] ? (
            <div style={{display: "flex", alignItems: "center"}}>
              <div className="audio-length">
                {formatDuration(array[index]["audio_length"])}
              </div>
            </div>
          ) : (
            <div className="audio-length-dummy">{"audioLength"}</div>
          )}
        </td>
        <td style={{ width: "15%" }}>
          {array[index]["date_posted"] ? (
            <div className="date-posted" style={{display: "flex", alignItems: "center"}}>
              {convertDate(array[index]["date_posted"])}
              <div style={{padding: "10px"}}>
              <Provider store={store}>
                <QueuePlaylistOptionsButtonContainer trackInfo={array[index]} index={index} playlistID={options?.playlistID} removeTrack={options?.removeTrack}/>
              </Provider>
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

  // const toggleLike = async (track: Track) => {
  //   console.log("toggling like for:", track.track_id)
  //   let email = store.getState().userSessionInfo.email
  //   await fetch("/api/user/collections/likedTracks/toggleLike", 
  //       {method: "POST", 
  //       body: JSON.stringify({email: email, trackID: track.track_id })})
  //   trigger("/api/user/collections/likedTracks/get/"+ email)
  // }

  const CurrentPlaylist = (props) => {
    console.log("props in CurrentPlaylist", props)
    let { currentPlaylist }: { currentPlaylist: QueuePlaylist } = props.queueInfo.QueueInfo

    const playTrackFromCurrentPlaylist = (trackID: string, index: number, track: Track, playlistID?: string) => {

      let playing = store.getState().audioPlayerInfo.playing
      store.dispatch(togglePlaying(!playing))

      store.dispatch(
        replaceCurrentTrack(track)
      )
      store.dispatch(
        removeTrackFromCurrentPlaylist(trackID, index)
      )
      syncQueueWithAudioPlayer(true)

    }
    const removeFromCurrentPlaylist = (trackID: string, index: number, playlistID: string) =>{

      store.dispatch(
          removeTrackFromCurrentPlaylist(trackID, index)
      )
      
      syncDB()
      syncQueueWithAudioPlayer(false)
  }

  if(currentPlaylist.tracks.length == 0){
    return(
      <div></div>
    )
  }

    return (
      <div style={{ width: "100%" }}>
        {
          <button style={{marginLeft: "10px"}} onClick={() => {
            store.dispatch(clearCurrentPlaylist());
            syncDB(); 
            syncQueueWithAudioPlayer(true);
          }}>clear</button>
        }

        {/* <ListGroup variant="flush"></ListGroup> */}
        <Table style={{overflowY: "visible", overflowX: "visible"}}  hover>
          {/* <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item> */}
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>{currentPlaylist.tracks.map((track: Track, index: number, array: Array<Track>) => {
                    return renderTrackOnTable(track, index, array, 
                      {playTrack: playTrackFromCurrentPlaylist, 
                        removeTrack: removeFromCurrentPlaylist, 
                        playlistID: currentPlaylist.playlistID, 
                        likedTracks: props.likedTracksInfo.LikedTracks,
                        likedTracksCollectionID: props.likedTracksCollectionID
                      }
                    )
                })}
          </tbody>
        </Table>
      </div>
    );
  };

  function mapStateToProps(state, ownProps) {
    // console.log("mapStateToProps", state)
    return state
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPlaylist)