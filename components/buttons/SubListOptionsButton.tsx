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

export default function SubListOptionsButton(props) {
    const {subList}:{subList: any} = props
    console.log("subList", subList)

    const addSubListToQueue = () =>{
        console.log("to be added to queue:", subList)
        for(var i = 0; i < subList.collections.length; i++){
            var collection = subList.collections[i]
            addCollectionToQueue(collection)
        }

        
        

    }

    const addCollectionToQueue = (collection) => {
        var tracks : Array<Track> = []

        for (const trackID in collection.tracks) {
            console.log(`${collection.tracks[trackID]}`);
            tracks.push(collection.tracks[trackID])
          }
        // for(var i = 0; i < playlist.tracks.length; i++){
            
        // }
        
        let queueStore = store.getState().queueInfo.QueueInfo
        
        let currentTrackUpdated = (
            queueStore.currentPlaylist.tracks.length == 0 &&
            queueStore.queue.length == 0 &&
            queueStore.currentTrack.cloud_storage_url == ""
            )
        
        var queuePlaylist = createQueuePlaylist(tracks, collection.collectionName)
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

    const handleDeleteSubList = async (email, subListID, subListName) => {
        console.log("deleting", subListID, "(" + subListName + ") for", email)
        await fetch("/api/user/sublists/deleteSubList/", {
            method: "DELETE", body: JSON.stringify({email: email, subListID: subListID, subListName: subListName})
        })
        trigger("/api/user/sublists/getSubLists/"+ email)
        Router.push("/home")
    }

    return (
        <Menu menuButton={<MoreHorizIcon />}>
            <MenuItem onClick={addSubListToQueue}>Add to queue</MenuItem>
            <MenuItem onClick={() => {
                handleDeleteSubList(
                    store.getState().userSessionInfo.email,
                    subList.subscriptionListID, 
                    subList.subscriptionListName 
                    )
                }}
            >Delete Daily Mix</MenuItem>

            {/* <SubMenu label="Add to Subscription List"> */}
            {/* <MenuItem>Render Subscription Lists dynamically</MenuItem> */}
                {/* render this dynamically later */}
                {/* <MenuItem>index.html</MenuItem>
                <MenuItem>example.js</MenuItem>
                <MenuItem>about.css</MenuItem> */}
            {/* </SubMenu> */}
        </Menu>
    );
}
