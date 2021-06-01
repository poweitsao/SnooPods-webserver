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

export default function SubListOptionsButton(props) {
    const {subList}:{subList: any} = props

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
        
        var queuePlaylist = createQueuePlaylist(tracks, collection.collectionName)
        console.log("queuePlaylist", queuePlaylist)
        store.dispatch(
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
            <MenuItem onClick={addSubListToQueue}>Add to queue</MenuItem>
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
