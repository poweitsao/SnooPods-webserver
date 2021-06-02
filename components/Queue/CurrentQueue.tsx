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
import toggleLike from '../../lib/toggleLike'
import { syncHistory } from "../../lib/syncHistory";
import { addToHistory } from "../../redux/actions/historyActions";

const renderTrackOnTable = (track: Track, index: number, array: Array<Track>, options?: any) => {
  // console.log("likedTracks in renderTrackOnTable", options.likedTracks)
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
//   // console.log("toggling like for:", track.track_id)
//   let email = store.getState().userSessionInfo.email
//   await fetch("/api/user/collections/likedTracks/toggleLike", 
//       {method: "POST", 
//       body: JSON.stringify({email: email, trackID: track.track_id })})
//   trigger("/api/user/collections/likedTracks/get/"+ email)
// }

const CurrentQueue = (props) => {
  let { queue }: { queue: Array<QueuePlaylist> } = props.queueInfo.QueueInfo
  console.log("props in CurrentQueue", props)
  // const [queue, setCurrentQueue] = useState(props.queue)

  // useEffect(() => {
  //   if(queue !== props.queue){
  //     setCurrentQueue(props.queue)
  //     // console.log("queue has changed")
  //   }
  // }, [queue])
  if(queue.length == 0){
    return(
      <div></div>
    )
  }
  
  return (
    <div style={{ width: "100%" }}>
      <div style={{width: "90%"}}>
        <div style={{ padding: "10px", paddingLeft: "25px"}}>Current Queue:</div>    
      </div>
      {queue.map((playlist, index) => {
        return QueueChunk(playlist, index, {
          likedTracks: props.likedTracksInfo.LikedTracks, 
          likedTracksCollectionID: props.likedTracksInfo.likedTracksCollectionID})
        })
      }
    </div>
  );
};

const QueueChunk = (playlist: QueuePlaylist, index: number, options: any) => {
  // console.log("--------> QueueChunk", playlist)
  // console.log("--------> QueueChunk trackID", playlist.tracks)


  const playTrackFromCurrentQueueChunk = (trackID: string, index: number, track: Track, playlistID:string) => {

    let playing = store.getState().audioPlayerInfo.playing
    store.dispatch(togglePlaying(!playing))

    store.dispatch(
      replaceCurrentTrack(track)
    )
    store.dispatch(
      removeTrackFromQueue(playlistID, trackID, index)
    )
    syncQueueWithAudioPlayer(true)

    store.dispatch(
      addToHistory(store.getState().queueInfo.QueueInfo.currentTrack.track_id)
    )
    syncHistory()    
  }

  const removeFromCurrentQueueChunk = (trackID: string, index: number, playlistID: string) =>{

    store.dispatch(
      removeTrackFromQueue(playlistID, trackID, index)
    )
    
    syncDB()
    syncQueueWithAudioPlayer(false)
  }


  return (
    <div key={playlist.playlistID + "_" + (index).toString}>
      {
        <div style={{padding: "10px", paddingLeft: "50px"}}>
          {playlist.playlistName}
          <button style={{marginLeft: "10px"}} onClick={() => {
            store.dispatch(removePlaylistFromQueue(playlist.playlistID)); 
            syncDB(); 
            syncQueueWithAudioPlayer(true);
          }}>clear</button>
        </div>
      }
      
      <div style={{ width: "95%", marginLeft: "auto" }}>
        <Table style={{overflowY: "visible", overflowX: "visible"}}  hover>
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>{playlist.tracks.map((track: Track, index: number, array: Array<Track>) => {
                  return renderTrackOnTable(track, index, array, 
                    { playTrack: playTrackFromCurrentQueueChunk,
                      removeTrack: removeFromCurrentQueueChunk, 
                      playlistID: playlist.playlistID,
                      likedTracks: options.likedTracks,
                      likedTracksCollectionID: options.likedTracksCollectionID
                    })
        })}</tbody>
        </Table>
      </div>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
    // console.log("mapStateToProps", state)
    return state
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(CurrentQueue)
// export default CurrentQueue