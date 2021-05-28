import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import React, { useEffect, useState } from "react";
import convertDate from "../../lib/convertDate";
import formatDuration from "../../lib/formatDuration";
import isEmpty from "../../lib/isEmptyObject";
import { syncDB, syncQueueWithAudioPlayer } from "../../lib/syncQueue";
import { togglePlaying } from "../../redux/actions";
import { replaceCurrentTrack, removeTrackFromCurrentPlaylist, removeTrackFromQueue, pushNextTrack, clearCurrentPlaylist, removePlaylistFromQueue } from "../../redux/actions/queueActions";
import { AudioPlayerStore, CollectionStore, LikedTracksStore, QueueStore, UserSessionStore } from "../../redux/store";
import { Track, QueuePlaylist } from "../../ts/interfaces";
import Icon from "@iconify/react";
import QueuePlaylistOptionsButtonContainer from "../containers/QueuePlaylistOptionsButtonContainer";
import { Table } from "react-bootstrap";
import { connect, Provider } from "react-redux";
import useSWR from "swr";

const CurrentQueue = (props) => {
  let { queue }: { queue: Array<QueuePlaylist> } = props
  console.log("props in CurrentQueue", props)
    // console.log("key", JSON.stringify(queue))
    return (
      <div key={JSON.stringify(queue)} style={{ width: "100%" }}>
        
        {queue.map(QueueChunk)}
      </div>
    );
  };

  const QueueChunk = (playlist: QueuePlaylist, index: number) => {

    const playTrackFromCurrentQueueChunk = (trackID: string, index: number, track: Track, playlistID:string) => {

      let playing = AudioPlayerStore.getState().playing
      AudioPlayerStore.dispatch(togglePlaying(!playing))

      QueueStore.dispatch(
        replaceCurrentTrack(track)
      )
      QueueStore.dispatch(
        removeTrackFromQueue(playlistID, trackID, index)
      )
      syncQueueWithAudioPlayer(true)

    }

    const removeFromCurrentQueueChunk = (trackID: string, index: number, playlistID: string) =>{

      QueueStore.dispatch(
        removeTrackFromQueue(playlistID, trackID, index)
      )
      
      syncDB()
      syncQueueWithAudioPlayer(false)
    }

    return (
      <div key={playlist.playlistID + "_" + playlist.tracks[index].track_id + "_" + (index).toString}>
        {
          <div style={{padding: "10px", paddingLeft: "50px"}}>
            {playlist.playlistName}
            <button style={{marginLeft: "10px"}} onClick={() => {
              QueueStore.dispatch(removePlaylistFromQueue(playlist.playlistID)); 
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
                    return renderTrackOnTable(track, index, array, {playTrack: playTrackFromCurrentQueueChunk, removeTrack: removeFromCurrentQueueChunk, playlistID: playlist.playlistID})
          })}</tbody>
          </Table>
        </div>
      </div>
    );
  }

  const renderTrackOnTable = (track: Track, index: number, array: Array<Track>, options?: any) => {
    const [playButton, setPlayButton] = useState(playCircleOutlined);
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
            <button 
                onClick={() => options?.playTrack(track.track_id, index, track, options?.playlistID)}
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
              <Provider store={CollectionStore}>
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

// function mapStateToProps(state, ownProps) {
//     // console.log("mapStateToProps", state)
//     return state
// }

// const mapDispatchToProps = (dispatch) => ({

// })

// export default connect(mapStateToProps, mapDispatchToProps)(CurrentQueue)
export default CurrentQueue