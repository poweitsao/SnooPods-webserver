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
        
        var queuePlaylist = createQueuePlaylist(tracks, playlist.collectionName)
        console.log("queuePlaylist", queuePlaylist)
        QueueStore.dispatch(
            addPlaylistToQueue(queuePlaylist)
        )
        syncDB()
        syncQueueWithAudioPlayer(false)

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
