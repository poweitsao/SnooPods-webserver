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
import { getQueue } from '../../lib/syncQueue';

const SubredditPlaylistOptionsButton = (props) => {
    const {playlist}:{playlist: any} = props
    // const [subLists, setSubList] = useState([])
    const subLists = props.subListInfo.SubLists
    const subID = props.subID
    const email = props.userSessionInfo.email


    const addSubPlaylistToQueue = async () =>{
        console.log("to be added to queue:", playlist)

        console.log("trackIDs", playlist.trackIDs)
        
        const addToQueueRes = await fetch("/api/queue/addToQueue", {method: "POST", body:JSON.stringify({trackIDs: playlist.trackIDs, email: email, playlistName: playlist.collectionName})})
        // var tracks : Array<Track> = await addToQueueRes.json()
        // if (playlist.trackIDs.length <= 5){
            
            
        // } else{
        //     //! get first 5 tracks, then update queue in background
        //     const getTracksRes = await fetch("/api/tracks/getTracks", {method: "POST", body:JSON.stringify({trackIDs: playlist.trackIDs})})
        //     tracks = await getTracksRes.json()
        // }
        // const jsonResult = await getTracksRes.json()
        // console.log("jsonResult", jsonResult)
        let queueStore = store.getState().queueInfo.QueueInfo
        
        let currentTrackUpdated = (
            queueStore.currentPlaylist.tracks.length == 0 &&
            queueStore.queue.length == 0 &&
            queueStore.currentTrack.cloud_storage_url == ""
            )
        await getQueue(email)



        
        // var queuePlaylist = createQueuePlaylist(tracks, playlist.collectionName)
        // console.log("queuePlaylist", queuePlaylist)
        // store.dispatch(
        //     addPlaylistToQueue(queuePlaylist)
        // )
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
            <MenuItem onClick={() => {addSubPlaylistToQueue()}}>Add to queue</MenuItem>
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
            {/* <SubMenu label="test">
                <MenuItem onClick={() => {addSubredditToSubList("dMvBlvK9sTphwj5IhgiY")}}>Test Add</MenuItem>
                <MenuItem onClick={() => {removeSubredditFromSubList("dMvBlvK9sTphwj5IhgiY", subID)}}>Test Delete</MenuItem>
                <MenuItem onClick={() => {renameSubList("dMvBlvK9sTphwj5IhgiY", "My name!!!")}}>Test Rename</MenuItem>

            </SubMenu> */}
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
