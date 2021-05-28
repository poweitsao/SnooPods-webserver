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
import { Provider } from "react-redux";
import useSWR from "swr";

import CurrentSong from "./CurrentSong"


const QueuePageBody = (props) => {
  let {currentTrack, currentPlaylist, queue} = props.QueueInfo
  console.log("QueuePageBody props", props)
  const {data: collections} = useSWR("/api/user/collections/getCollections/"+ UserSessionStore.getState().email)
  

  useEffect(() => {
    if(collections){
      console.log("collections fro useSWR", collections)
      CollectionStore.dispatch({
        type:"STORE_COLLECTIONS",
        collections: collections
      })
    }
  }, [collections]);

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
    
      const CurrentPlaylist = ({ playlist }: { playlist: QueuePlaylist }) => {
        const playTrackFromCurrentPlaylist = (trackID: string, index: number, track: Track, playlistID?: string) => {
  
          let playing = AudioPlayerStore.getState().playing
          AudioPlayerStore.dispatch(togglePlaying(!playing))
  
          QueueStore.dispatch(
            replaceCurrentTrack(track)
          )
          QueueStore.dispatch(
            removeTrackFromCurrentPlaylist(trackID, index)
          )
          syncQueueWithAudioPlayer(true)
  
        }
        const removeFromCurrentPlaylist = (trackID: string, index: number, playlistID: string) =>{

          QueueStore.dispatch(
              removeTrackFromCurrentPlaylist(trackID, index)
          )
          
          syncDB()
          syncQueueWithAudioPlayer(false)
      }

        return (
          <div style={{ width: "100%" }}>
            {/* <ListGroup variant="flush"></ListGroup> */}
            <Table style={{overflowY: "visible", overflowX: "visible"}}  hover>
              {/* <ListGroup.Item ><div style={{ paddingLeft: "45px" }}>Title</div></ListGroup.Item> */}
              <thead>
                <tr>
                </tr>
              </thead>
              <tbody>{playlist.tracks.map((track: Track, index: number, array: Array<Track>) => {
                        return renderTrackOnTable(track, index, array, 
                          {playTrack: playTrackFromCurrentPlaylist, removeTrack: removeFromCurrentPlaylist, playlistID: playlist.playlistID}
                        )
                    })}
              </tbody>
            </Table>
          </div>
        );
      };
    
      // const CurrentSong = ({ track }: { track: Track }) => {
      //   const playCurrentTrack = (trackID: string, index: number, track: Track, playlistID?: string) => {
      //     // console.log("playing...")
      //     let playing = AudioPlayerStore.getState().playing
      //     AudioPlayerStore.dispatch(togglePlaying(!playing))
      //   }

      //   const removeCurrentTrack = (trackID: string, index: number, track: Track, playlistID?: string) => {
      //     // console.log("playing...")
      //     let playing = AudioPlayerStore.getState().playing
      //     AudioPlayerStore.dispatch(togglePlaying(!playing))
      //     QueueStore.dispatch(
      //       pushNextTrack()
      //     )
      //     syncDB()
      //     syncQueueWithAudioPlayer(false)
      //   }
      //   return (
      //     <div style={{ width: "100%"}}>
      //       <Table style={{overflowY: "visible", overflowX: "visible"}}  hover >
      //         <thead>
      //           <tr>
      //           </tr>
      //         </thead>
      //         <tbody>{[track].map((track: Track, index: number, array: Array<Track>) => {
      //           return renderTrackOnTable(track, index, array, {playTrack: playCurrentTrack, removeTrack:removeCurrentTrack })
      //         })
      //         }</tbody>
      //       </Table>
      //     </div>
      //   );
      // };
    
      const CurrentQueue = ({ queue }: { queue: Array<QueuePlaylist> }) => {
        return (
          <div style={{ width: "100%" }}>
            
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

    return (
        <div className="page-body">
              {currentTrack.cloud_storage_url == "" ? (
                <div>Nothing here.</div>
              ) : (
                <div style={{width: "90%"}}>
                  <div style={{ padding: "10px", paddingLeft: "25px"}}>Current Track:</div>
                  <Provider store={LikedTracksStore}>
                    <CurrentSong track={currentTrack}/>
                  </Provider>
                </div>
              )}
              {currentPlaylist.tracks.length == 0 
                ? <div></div> 
                : (
                    <div style={{width: "90%"}}>
                      <div style={{padding: "10px", paddingLeft: "25px"}}>
                        Currently Playing: 
                        <button style={{marginLeft: "10px"}} onClick={() => {
                          QueueStore.dispatch(clearCurrentPlaylist());
                          syncDB(); 
                          syncQueueWithAudioPlayer(true);
                        }}>clear</button>
                      </div>
                      <CurrentPlaylist playlist={currentPlaylist}/>
                    </div>
                  )
              }
                
              {queue.length == 0
                ? <div></div>
                :<div style={{width: "90%"}}>
                  <div style={{padding: "10px", paddingLeft: "25px"}}>Queue:</div>
                  <CurrentQueue queue={queue}/>
                </div>
              }
              <style>
                {`.page-body{
                margin-top: 30px;
                margin-bottom: 100px;
                display:flex;
                flex-direction:column;
                justify-content:nowrap;
                align-items:center;
                
                overflow-y: scroll;
                }`}
              </style>
        </div>
    )
}

export default QueuePageBody