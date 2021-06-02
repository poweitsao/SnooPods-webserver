import React, { useEffect, useState } from 'react';
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
import { connect } from 'react-redux';
import { syncHistory } from '../../lib/syncHistory';
import { addToHistory } from '../../redux/actions/historyActions';

const SubredditPlaylistOptionsButton = (props) => {
    const {playlist}:{playlist: any} = props
    // const [subLists, setSubList] = useState([])
    const subLists = props.subListInfo.SubLists
    const subID = props.subID
    const email = props.userSessionInfo.email
    // console.log("props", props)

    // useEffect(()=>{
    //     if(subLists !== props.subListInfo && props.subListInfo.SubLists.length > 0){
            
    //         setSubList(props.subListInfo.SubLists)
    //     }
    //     console.log("props.subListInfo", props.subListInfo.SubLists)
    //     console.log("props.subListInfo", typeof(props.subListInfo.SubLists))

    // }, [props])

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

    const addSubredditToSubList = async (subListID: string) => {

        await fetch("/api/user/sublists/editSubList", {
            method: "POST", 
            body: JSON.stringify({
                action: "addSubreddit",
                fields: {
                    subListID: subListID, 
                    newSubID: subID, 
                    email: email
                }
        })})

    }

    const removeSubredditFromSubList = async (subListID: string, subIDToRemove: string) => {

        await fetch("/api/user/sublists/editSubList", {
            method: "POST", 
            body: JSON.stringify({
                action: "removeSubreddit",
                fields: {
                    subListID: subListID, 
                    subIDToRemove: subIDToRemove, 
                    email: email
                }
        })})

    }

    const renameSubList = async (subListID: string, newSubListName: string) => {

        await fetch("/api/user/sublists/editSubList", {
            method: "POST", 
            body: JSON.stringify({
                action: "renameSubList",
                fields: {
                    newSubListName: newSubListName, 
                    subListID: subListID, 
                    email: email
                }
        })})

    }

    const renderSubListsSubMenu = (subList: any, index: number) => {
        let subListID = subList.subscriptionListID
        // console.log("subList in renderSubListsSubMenu", subList)
        return(
            <MenuItem key={index} 
                    onClick={() => {
                        addSubredditToSubList(subListID)}}
            >{subList.subscriptionListName}</MenuItem>
        )
    }

    return (
        <Menu menuButton={<MoreHorizIcon />}>
            <MenuItem onClick={addSubPlaylistToQueue}>Add to queue</MenuItem>
            <SubMenu label="Add to Daily Mix">
                {subLists.map(renderSubListsSubMenu)}
                {/* {props.subListInfo !== undefined
                    ?{return props.subListInfo.map(renderSubListsSubMenu)}
                    :<MenuItem>index.html</MenuItem>

                } */}

                
            {/* <MenuItem>Render Subscription Lists dynamically</MenuItem> */}
                {/* render this dynamically later */}
                {/* <MenuItem>index.html</MenuItem>
                <MenuItem>example.js</MenuItem>
                <MenuItem>about.css</MenuItem> */}
            </SubMenu>
            <SubMenu label="test">
                <MenuItem onClick={() => {addSubredditToSubList("dMvBlvK9sTphwj5IhgiY")}}>Test Add</MenuItem>
                <MenuItem onClick={() => {removeSubredditFromSubList("dMvBlvK9sTphwj5IhgiY", subID)}}>Test Delete</MenuItem>
                <MenuItem onClick={() => {renameSubList("dMvBlvK9sTphwj5IhgiY", "My name!!!")}}>Test Rename</MenuItem>

            </SubMenu>
        </Menu>
    );
}

function mapStateToProps(state, ownProps) {
    // console.log("mapStateToProps", state)
    return state
  }
  
  const mapDispatchToProps = (dispatch) => ({
  
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SubredditPlaylistOptionsButton)
