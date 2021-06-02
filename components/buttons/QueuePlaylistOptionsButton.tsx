import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import {addPlaylistToQueue, removeTrackFromCurrentPlaylist} from "../../redux/actions/queueActions"
import store from "../../redux/store"
import {Track} from "../../ts/interfaces"
import {syncDB, syncQueueWithAudioPlayer} from "../../lib/syncQueue"
import { syncHistory } from '../../lib/syncHistory';
import { addToHistory } from '../../redux/actions/historyActions';

export default function QueuePlaylistOptionsButton(props) {
    // console.log("props in QueuePlaylistOptionsButton", props)
    const {trackInfo, index, removeTrack, playlistID}:{trackInfo: Track, index: number, removeTrack: any, playlistID: string} = props

    const addTrackToQueue = () =>{
        // console.log(trackInfo)
        var queuePlaylist = createQueuePlaylist([trackInfo], "${singleTrack}")
        // console.log("queuePlaylist", queuePlaylist)
        let queueStore = store.getState().queueInfo.QueueInfo

        let currentTrackUpdated = (
            queueStore.currentPlaylist.tracks.length == 0 &&
            queueStore.queue.length == 0 &&
            queueStore.currentTrack.cloud_storage_url == ""
            )

        store.dispatch(
            addPlaylistToQueue(queuePlaylist)
        )
        syncDB()
        syncQueueWithAudioPlayer(false)
        
        console.log("currentTrackUpdated", currentTrackUpdated)
        if (currentTrackUpdated){
            store.dispatch(
                addToHistory(store.getState().queueInfo.QueueInfo.currentTrack.track_id)
              )
            syncHistory()
        }
    }



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

    const addTrackToCollection = (collectionID) => {
        // console.log("adding track", trackInfo.track_name ," to collection")
        fetch("/api/user/collections/editCollection", 
            { method: "POST", body: JSON.stringify({
                action:"addTrack",
                fields: {
                    collectionID: collectionID,
                    newTrackID: trackInfo.track_id,
                    email: store.getState().userSessionInfo.email
                }
            }) 
        })
    }

    const renderCollectionsSubmenu = (collection, index) => {
        let collectionID = collection.collectionID
        return(
            <MenuItem key={index} onClick={() => {addTrackToCollection(collectionID)}}>{collection.collectionName}</MenuItem>
        )

    }

    const collections = store.getState().collectionInfo

    return (
        <Menu menuButton={<MoreHorizIcon />}>
            <MenuItem onClick={addTrackToQueue}>Add to queue</MenuItem>
            <MenuItem onClick={() => {removeTrack(trackInfo.track_id, index, playlistID)}}>Remove</MenuItem>

            <MenuItem>Go to Subreddit</MenuItem>
            <SubMenu label="Add to collection">
                {props.collectionInfo.Collections.map(renderCollectionsSubmenu)}
            {/* <MenuItem>Render collections dynamically</MenuItem> */}
                {/* render this dynamically later */}
                {/* <MenuItem>index.html</MenuItem>
                <MenuItem>example.js</MenuItem>
                <MenuItem>about.css</MenuItem> */}
            </SubMenu>
        </Menu>
    );
}
