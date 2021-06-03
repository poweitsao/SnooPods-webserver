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
import {QueuePlaylist, Track} from "../../ts/interfaces"
import {syncDB, syncQueueWithAudioPlayer} from "../../lib/syncQueue"
import { syncHistory } from '../../lib/syncHistory';
import { addToHistory } from '../../redux/actions/historyActions';
import { trigger } from 'swr';
import Router from 'next/router';

export default function CollectionOptionsButton(props) {
    const {playlist, collectionID, collectionName}:{playlist: any, collectionID: string, collectionName: string} = props

    const addSubPlaylistToQueue = () =>{
        console.log("to be added to queue:", playlist)
        var tracks : Array<Track> = []

        for (const trackID in playlist.tracks) {
            console.log(`${playlist.tracks[trackID]}`);
            tracks.push(playlist.tracks[trackID])
          }
        // for(var i = 0; i < playlist.tracks.length; i++){
            
        // }
        let queueStore = store.getState().queueInfo.QueueInfo

        let currentTrackUpdated = (
            queueStore.currentPlaylist.tracks.length == 0 &&
            queueStore.queue.length == 0 &&
            queueStore.currentTrack.cloud_storage_url == ""
            )

        var queuePlaylist = createQueuePlaylist(tracks, playlist.collectionName)
        console.log("queuePlaylist", queuePlaylist)
        store.dispatch(
            addPlaylistToQueue(queuePlaylist)
        )
        syncDB()
        syncQueueWithAudioPlayer(false)
        
        console.log("currentTrackUpdated", currentTrackUpdated)
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

    const handleDeleteCollection = async(email: string, collectionID: string, collectionName: string) =>{
        // console.log("delete collection clicked")
        // console.log(email)
        // console.log(collectionID)
        // console.log(collectionName)

        await fetch("/api/user/collections/deleteCollection/", {
            method: "DELETE", body: JSON.stringify({email: email, collectionID: collectionID, collectionName: collectionName})
        })
        trigger("/api/user/collections/getCollections/"+email)
        Router.push("/home")
    }

    return (
        <Menu menuButton={<MoreHorizIcon />}>
            <MenuItem onClick={addSubPlaylistToQueue}>Add to queue</MenuItem>
            <MenuItem onClick={() => {
                handleDeleteCollection(store.getState().userSessionInfo.email, collectionID, collectionName)
                }}>Delete Collection</MenuItem>

            
        </Menu>
    );
}
