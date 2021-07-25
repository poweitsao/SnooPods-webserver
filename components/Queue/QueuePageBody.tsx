import playCircleFilled from "@iconify/icons-ant-design/play-circle-filled";
import playCircleOutlined from "@iconify/icons-ant-design/play-circle-outlined";
import React, { useEffect, useState } from "react";
import convertDate from "../../lib/convertDate";
import { formatDuration } from "../../lib/formatDuration";
import isEmpty from "../../lib/isEmptyObject";
import { getQueue, syncDB, syncQueueWithAudioPlayer } from "../../lib/syncQueue";
import { togglePlaying } from "../../redux/actions";
import { replaceCurrentTrack, removeTrackFromCurrentPlaylist, removeTrackFromQueue, pushNextTrack, clearCurrentPlaylist, removePlaylistFromQueue } from "../../redux/actions/queueActions";
import store from "../../redux/store";
import { Track, QueuePlaylist } from "../../ts/interfaces";
import Icon from "@iconify/react";
import QueuePlaylistOptionsButtonContainer from "../containers/QueuePlaylistOptionsButtonContainer";
import { Table } from "react-bootstrap";
import { connect, Provider } from "react-redux";
import useSWR from "swr";

import CurrentSong from "./CurrentSong"
import CurrentQueue from "./CurrentQueue"
import CurrentPlaylist from "./CurrentPlaylist"
import CurrentPlaylistUsingQueue from "./CurrentPlaylistUsingQueue"


const QueuePageBody = (props) => {
    
  const {data: collections} = useSWR("/api/user/collections/getCollections/"+ props.user.email)  

  useEffect(() => {

    
    if(collections){
      store.dispatch({
        type:"STORE_COLLECTIONS",
        collections: collections
      })
    }

  }, [collections, props]);

      

    return (
        <div className="page-body">
          <div style={{width: "100%"}}>
            <button onClick={()=>getQueue(store.getState().userSessionInfo.email)}>refresh</button>
          </div>

              <Provider store={store}>
                <CurrentSong />
              </Provider>
              <Provider store={store}>
                <CurrentPlaylist />

              </Provider>
                
              <Provider store={store}>
                <CurrentQueue/>
              </Provider>
              <style>
                {`.page-body{
                    display:flex;
                    flex-direction:column;
                    justify-content:nowrap;
                    align-items:center;
                    overflow-y:scroll;
                }`}
              </style>
        </div>
    )
}

export default QueuePageBody
