import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import {addPlaylistToQueue} from "../../redux/actions/queueActions"
import store from "../../redux/store"
import {Track} from "../../ts/interfaces"
import {syncDB, syncQueueWithAudioPlayer} from "../../lib/syncQueue"
import { syncHistory } from '../../lib/syncHistory';
import { addToHistory } from '../../redux/actions/historyActions';
import Router from 'next/router';


export default function PanelTrackOptionsButton(props) {


    const {trackInfo}:{trackInfo: Track} = props
    const {width, height}:{width: string, height: string} = props

    const addTrackToQueue = () =>{
        // console.log(trackInfo)

        let queueStore = store.getState().queueInfo.QueueInfo
        
        let currentTrackUpdated = (
            queueStore.currentPlaylist.tracks.length == 0 &&
            queueStore.queue.length == 0 &&
            queueStore.currentTrack.cloud_storage_url == ""
            )

        var queuePlaylist = createQueuePlaylist([trackInfo], "${singleTrack}")
        console.log("queuePlaylist", queuePlaylist)
        store.dispatch(
            addPlaylistToQueue(queuePlaylist)
        )
        
        syncDB()
        syncQueueWithAudioPlayer(false)

        if (currentTrackUpdated){
            store.dispatch(
                addToHistory(store.getState().queueInfo.QueueInfo.currentTrack)
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


    const addTrackToCollection = (collectionID: string) => {
        // console.log("adding track", trackInfo.track_name ," to collection")
        // console.log("addTrackToCollection fields", props)
        console.log("addTrackToCollection fields", collectionID, trackInfo.track_id, store.getState().userSessionInfo.email)
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
        // console.log("collection in renderCollectionsSubMenu", collection)
        return(
            <MenuItem key={index} 
                    onClick={() => {
                        addTrackToCollection(collectionID)}}
            >{collection.collectionName}</MenuItem>
        )

    }

    return (
        <Menu menuButton={<MoreHorizIcon viewBox="0 0 10 30" style={{width: width, height: height}}/>}>
            <MenuItem onClick={addTrackToQueue}>Add to queue</MenuItem>
            <MenuItem onClick={() => {Router.push("/subreddit/"+ trackInfo.subreddit)}}>Go to Subreddit</MenuItem>
            <SubMenu label="Add to collection">
                {props.collectionInfo.Collections.map(renderCollectionsSubmenu)}
                {/* render this dynamically later */}
                {/* <MenuItem>index.html</MenuItem>
                <MenuItem>example.js</MenuItem>
                <MenuItem>about.css</MenuItem> */}
            </SubMenu>
        </Menu>
    );
}
