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
import {QueueStore, AudioPlayerStore, UserSessionStore} from "../../redux/store"
import {Track} from "../../ts/interfaces"
import {syncDB} from "../../lib/syncQueue"

export default function TrackOptionsButton(props) {
    const {trackInfo}:{trackInfo: Track} = props

    const addTrackToQueue = () =>{
        // console.log(trackInfo)
        var queuePlaylist = createQueuePlaylist([trackInfo], "${singleTrack}")
        console.log("queuePlaylist", queuePlaylist)
        QueueStore.dispatch(
            addPlaylistToQueue(queuePlaylist)
        )
        
        syncDB()

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
