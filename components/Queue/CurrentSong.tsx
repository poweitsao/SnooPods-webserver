
import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { syncDB, syncQueueWithAudioPlayer } from '../../lib/syncQueue'
import { togglePlaying } from '../../redux/actions'
import { pushNextTrack } from '../../redux/actions/queueActions'
import { AudioPlayerStore, CollectionStore, QueueStore, UserSessionStore } from '../../redux/store'
import { Track } from '../../ts/interfaces'
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled'
import playCircleOutlined from '@iconify/icons-ant-design/play-circle-outlined'
import Icon from "@iconify/react";
import { connect, Provider } from 'react-redux'
import convertDate from '../../lib/convertDate'
import formatDuration from '../../lib/formatDuration'
import QueuePlaylistOptionsButtonContainer from '../containers/QueuePlaylistOptionsButtonContainer'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { trigger } from 'swr'
import PlayButton from "../buttons/PlayButton"
import toggleLike from "../../lib/toggleLike"


const CurrentSong = (props) => {

    let { track }: { track: Track } = props


    const playCurrentTrack = (trackID: string, index: number, track: Track, playlistID?: string) => {
      // console.log("playing...")
      let playing = AudioPlayerStore.getState().playing
      AudioPlayerStore.dispatch(togglePlaying(!playing))
    }

    const removeCurrentTrack = (trackID: string, index: number, track: Track, playlistID?: string) => {
      let playing = AudioPlayerStore.getState().playing
      AudioPlayerStore.dispatch(togglePlaying(!playing))
      QueueStore.dispatch(
        pushNextTrack()
      )
      syncDB()
      syncQueueWithAudioPlayer(false)
    }

    const renderTrackOnTable = (track: Track, index: number, array: Array<Track>, options?: any) => {
        // const [playButton, setPlayButton] = useState(playCircleOutlined);
        // console.log("props in CurrentSong, render track on table", props)
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
                  width="24px"        
                  height="24px"  
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
                        onClick={ () => toggleLike(track, props.likedTracksCollectionID)}

                >
                    {props.LikedTracks.includes(track.track_id)
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

    // const toggleLike = async (track: Track) => {
    //     console.log("toggling like for:", track.track_id)
    //     let email = UserSessionStore.getState().email
    //     await fetch("/api/user/collections/likedTracks/toggleLike", 
    //         {method: "POST", 
    //         body: JSON.stringify({email: email, trackID: track.track_id })})
    //     trigger("/api/user/collections/likedTracks/get/"+ email)
    // }

    return (
      <div style={{ width: "100%"}}>
        <Table style={{overflowY: "visible", overflowX: "visible"}}  hover >
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>{[track].map((track: Track, index: number, array: Array<Track>) => {
            return renderTrackOnTable(track, index, array, {
              playTrack: playCurrentTrack, 
              removeTrack:removeCurrentTrack 
            })
          })
          }</tbody>
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

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSong)