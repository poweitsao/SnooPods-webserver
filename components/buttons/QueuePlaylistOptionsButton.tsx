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
import {QueueStore, AudioPlayerStore, UserSessionStore} from "../../redux/store"
import {Track} from "../../ts/interfaces"
import {syncDB, syncQueueWithAudioPlayer} from "../../lib/syncQueue"

export default function QueuePlaylistOptionsButton(props) {
    const {trackInfo, index, removeTrack, playlistID}:{trackInfo: Track, index: number, removeTrack: any, playlistID: string} = props

    const addTrackToQueue = () =>{
        // console.log(trackInfo)
        var queuePlaylist = createQueuePlaylist([trackInfo], "${singleTrack}")
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
            <MenuItem onClick={addTrackToQueue}>Add to queue</MenuItem>
            <MenuItem onClick={() => {removeTrack(trackInfo.track_id, index, playlistID)}}>Remove</MenuItem>

            <MenuItem>Go to Subreddit</MenuItem>
            <SubMenu label="Add to collection">
            <MenuItem>Render collections dynamically</MenuItem>
                {/* render this dynamically later */}
                {/* <MenuItem>index.html</MenuItem>
                <MenuItem>example.js</MenuItem>
                <MenuItem>about.css</MenuItem> */}
            </SubMenu>
        </Menu>
    );
}
