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


export default function TrackOptionsButton(props) {


    const {trackInfo}:{trackInfo: Track} = props
    console.log("TrackOptionsButton props", props)

    const addTrackToQueue = () =>{
        // console.log(trackInfo)
        var queuePlaylist = createQueuePlaylist([trackInfo], "${singleTrack}")
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
        <Menu menuButton={<MoreHorizIcon />}>
            <MenuItem onClick={addTrackToQueue}>Add to queue</MenuItem>
            <MenuItem>Go to Subreddit</MenuItem>
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
