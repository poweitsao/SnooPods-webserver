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

const renderTrackOnTable = (track: Track, index: number, array: Array<Track>, options?: any) => {
  // console.log("likedTracks in renderTrackOnTable", options.likedTracks)
  console.log("array in renderTrackOnTable", array)
  return (
    <tr key={options.subListID + "_" + track.track_id + "_" + index.toString()}>
      <td style={{ width: "5%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingLeft: "12px",
          }}
        >
          <PlayButton 
            handleClick={() => options?.playTrack(track.track_id, index, track, options?.subListID)}
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
            <Provider store={CollectionStore}>
              <QueuePlaylistOptionsButtonContainer trackInfo={array[index]} index={index} subListID={options?.subListID} removeTrack={options?.removeTrack}/>
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
//   let email = UserSessionStore.getState().email
//   await fetch("/api/user/collections/likedTracks/toggleLike", 
//       {method: "POST", 
//       body: JSON.stringify({email: email, trackID: track.track_id })})
//   trigger("/api/user/collections/likedTracks/get/"+ email)
// }

const CurrentSubList = (props) => {
  let { subList }: { subList: Array<any> } = props
//   console.log("props in CurrentSubList", props)
  return (
    <div style={{ width: "100%" }}>
      
      {subList.map((subList, index) => {
        return SubListChunk(subList, index, {
          likedTracks: props.LikedTracks, 
          likedTracksCollectionID: props.likedTracksCollectionID})
        })
      }
    </div>
  );
};

const SubListChunk = (subList: any, index: number, options: any) => {
//   console.log("--------> SubListChunk", subList)
//   console.log("--------> SubListChunk trackID", subList.tracks)


  const playTrackFromCurrentSubListChunk = (trackID: string, index: number, track: Track, subListID:string) => {

    let playing = AudioPlayerStore.getState().playing
    AudioPlayerStore.dispatch(togglePlaying(!playing))

    QueueStore.dispatch(
      replaceCurrentTrack(track)
    )
    QueueStore.dispatch(
      removeTrackFromQueue(subListID, trackID, index)
    )
    syncQueueWithAudioPlayer(true)

  }

  const removeFromCurrentSubListChunk = (trackID: string, index: number, subListID: string) =>{

    QueueStore.dispatch(
      removeTrackFromQueue(subListID, trackID, index)
    )
    
    syncDB()
    syncQueueWithAudioPlayer(false)
  }

  return (
    <div key={subList.collectionID + "_" + (index).toString}>
      {
        <div style={{padding: "10px", paddingLeft: "50px"}}>
          {subList.subListName}
          <button style={{marginLeft: "10px"}} onClick={() => {
            QueueStore.dispatch(removePlaylistFromQueue(subList.collectionID)); 
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
          <tbody>{subList.tracks.map((track: Track, index: number, array: Array<Track>) => {
                  return renderTrackOnTable(track, index, array, 
                    { playTrack: playTrackFromCurrentSubListChunk,
                      removeTrack: removeFromCurrentSubListChunk, 
                      subListID: subList.collectionID,
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

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSubList)
// export default CurrentSubList