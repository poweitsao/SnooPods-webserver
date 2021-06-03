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

export default function PlaylistOptionsButton(props) {
    const {playlist}:{playlist: any} = props

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

    return (
        <Menu menuButton={<MoreHorizIcon />}>
            <MenuItem onClick={addSubPlaylistToQueue}>Add to queue</MenuItem>
            <SubMenu label="Add to Subscription List">
            <MenuItem>Render Subscription Lists dynamically</MenuItem>
                {/* render this dynamically later */}
                {/* <MenuItem>index.html</MenuItem>
                <MenuItem>example.js</MenuItem>
                <MenuItem>about.css</MenuItem> */}
            </SubMenu>
        </Menu>
    );
}
