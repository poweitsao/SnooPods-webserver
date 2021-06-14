import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from "react-bootstrap"
import { server } from '../../config';
import fetch from "isomorphic-unfetch";
import isEmpty from '../../lib/isEmptyObject';
import useSWR, {trigger} from 'swr';
import AddButton from "../buttons/AddButton"
import DeleteButton from "../buttons/DeleteButton"
import Router from "next/router"
import store from '../../redux/store';
import {storeLikedTracks} from "../../redux/actions/likedTracksActions"
import EmptySideBar from './EmptySideBar';
import CollectionIcon from "../../resources/icons/left/collection/collection_icon.svg"
import ExploreIcon from "../../resources/icons/left/explore/explore_icon.svg"
import FavoriteIcon from "../../resources/icons/left/favorite/favorite_icon.svg"
import HomeIcon from "../../resources/icons/left/home/home_icon.svg"
import MixIcon from "../../resources/icons/left/mix/mix_icon.svg"
import LibraryIcon from "../../resources/icons/left/library/library_icon.svg"
import { SvgIcon } from '@material-ui/core';




const MyMusicOption = ({redirect, name, icon}) => {
    return(
        <div className="my-music-option-container">
            {/* <div className="my-music-option-icon"></div> */}
            <SvgIcon className="my-music-option-icon" component={icon} />

                <Nav.Link 
                    style={{color: "#5c6096", padding: "unset", paddingLeft: "25px", paddingTop: "9.5px", paddingBottom:"9.5px", width: "100%"}} 
                    onClick={() => { Router.push(redirect) }}>
                    {name}
                </Nav.Link>
            <style>{`
                .my-music-option-container{
                    display: flex;
                    align-items: center;  
                    font-family: Lato, sans-serif;
                    font-size: 14px;
                    padding-left: 9.4%;
                }
                .my-music-option-icon{
                    color: #5c6096;
                    width: 22px;
                    height: 22px;   
                }
            `}</style>
        </div>
    )
}

const Sidebar = (props) => {
    const [mounted, setMounted] = useState(false)
    const [showCollectionDelete, setShowCollectionDelete] = useState([])
    const [showSubListDelete, setshowSubListDelete] = useState([])

    const [email, setEmail] = useState(props.user.email)
    const {data: collections} = useSWR("/api/user/collections/getCollections/"+ props.user.email)
    // const collections = []
    const {data: likedTracks} = useSWR("/api/user/collections/likedTracks/get/"+ props.user.email)

    const {data: subLists} = useSWR("/api/user/sublists/getSubLists/"+ props.user.email)
    const {data: history} = useSWR("/api/user/history/get/"+ props.user.email)


    // if(likedTracks){
    //     console.log("likedTracks in sidebar", likedTracks)
    // }

    useEffect(() => {
        setMounted(true)

        if (collections !== undefined){
            if (collections.length !== showCollectionDelete.length){
                setShowCollectionDelete([...Array(collections.length)].map((_, i) => false))
            }
        }
        if(likedTracks){
            store.dispatch({
                type: "STORE_LIKED_TRACKS",
                likedTracks: likedTracks.tracks,
                collectionID: likedTracks.collectionID
            })
            // console.log("likedTracks", store.getState().likedTracksInfo)
        }
        if(collections){
            // console.log("collections from useSWR", collections)
            store.dispatch({
              type:"STORE_COLLECTIONS",
              collections: collections
            })
          }


        if(subLists){
            // console.log("subLists from useSWR", subLists)
            if (subLists.length !== showSubListDelete.length){
                setshowSubListDelete([...Array(subLists.length)].map((_, i) => false))
            }
            store.dispatch({
                type:"STORE_SUBLISTS",
                subLists: subLists
            })
            // console.log("subLists from redux", store.getState().subListInfo)
        }
        if(history){
            
            store.dispatch({
                type:"STORE_HISTORY",
                history: history
            })
        }

      }, [collections, likedTracks, subLists, history]);

    if(!collections|| !likedTracks || !subLists || !history){
        return <EmptySideBar/>
    } 

    const renderCollections = (collection, index) => {
        const collectionID = collection.collectionID
        const collectionName = collection.collectionName
        return(
            <div key={collectionID} style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "100%"}}
                 onMouseEnter={() => {
                    let array = showCollectionDelete.map((item, itemIndex) => {
                        if (itemIndex == index){
                            return true
                        } else{
                            return false
                        }
                    })
                    setShowCollectionDelete(array)
                }}
                onMouseLeave={() => {
                    let array = showCollectionDelete.map((item, itemIndex) => {
                        return false
                    })
                    setShowCollectionDelete(array)
                }}
                >
                {showCollectionDelete[index]
                    ?<DeleteButton width={"24px"} height={"24px"} handleClick={() =>{handleDeleteCollection(email, collectionID, collectionName )}}/>
                    :<div style={{width: "24px", height: "24px"}}></div>}
                    
                <Nav.Link
                    style={{ 
                        flex: "1", 
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color:"#5c6096"
                         }} 
                                        
                    onClick={() => { Router.push("/collection/"+collection.collectionID) 
                }}>{collection.collectionName}</Nav.Link>
            </div>
        )
    }

    const handleAddCollection = async (email, collectionName) =>{
        await fetch("/api/user/collections/addNewCollection/", {
            method: "POST", body: JSON.stringify({email: email, collectionName: collectionName})
        })
        trigger("/api/user/collections/getCollections/"+email)
    }

    const handleDeleteCollection = async(email, collectionID, collectionName) =>{
        // console.log("delete collection clicked")
        // console.log(email)
        // console.log(collectionID)
        // console.log(collectionName)

        await fetch("/api/user/collections/deleteCollection/", {
            method: "DELETE", body: JSON.stringify({email: email, collectionID: collectionID, collectionName: collectionName})
        })
        trigger("/api/user/collections/getCollections/"+email)
    }

    const renderSubLists = (subList, index) => {
        // console.log("params in renderSubLists", subList, index)
        // console.log(showSubListDelete)
        const subListID = subList.subscriptionListID
        const subListName = subList.subscriptionListName
        return(
            <div key={subListID} style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "100%"}}
                 onMouseEnter={() => {
                    let array = showSubListDelete.map((item, itemIndex) => {
                        if (itemIndex == index){
                            return true
                        } else{
                            return false
                        }
                    })
                    setshowSubListDelete(array)
                }}
                onMouseLeave={() => {
                    let array = showSubListDelete.map((item, itemIndex) => {
                        return false
                    })
                    setshowSubListDelete(array)
                }}
                >
                {showSubListDelete[index]
                    ?<DeleteButton width={"24px"} height={"24px"} handleClick={() =>{handleDeleteSubList(email, subListID, subListName )}}/>
                    :<div style={{width: "24px", height: "24px"}}></div>}
                    
                <Nav.Link
                    style={{ 
                        flex: "1", 
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        "color": "#5c6096"
                         }} 
                                        
                    // onClick={() => { Router.push("/subList/"+subList.subListID) 
                    onClick={()=> {Router.push("/subList/"+subList.subscriptionListID)}}>
                    {subListName}
                </Nav.Link>
            </div>
        )
    }

    // const testGetSublistCollections = async (email, subListID) => {
    //     const res = await fetch("/api/user/sublists/get/" + email + "/" + subListID)
    //     let response = await res.json()
    //     console.log("sublistCollections", response)
    // }

    const handleAddSubList = async (email, subListName) =>{
        await fetch("/api/user/sublists/addNewSubList/", {
            method: "POST", body: JSON.stringify({email: email, subListName: subListName})
        })
        trigger("/api/user/sublists/getSubLists/"+ email)
    }

    const handleDeleteSubList = async (email, subListID, subListName) => {
        console.log("deleting", subListID, "(" + subListName + ") for", email)
        await fetch("/api/user/sublists/deleteSubList/", {
            method: "DELETE", body: JSON.stringify({email: email, subListID: subListID, subListName: subListName})
        })
        trigger("/api/user/sublists/getSubLists/"+ email)
    }

    return (
        <Navbar className="sidebar" style={{
            backgroundImage: "linear-gradient(to bottom, #1d2460, #131639)",
            width: "13.75%",
            height:"90.5%",
            flexDirection: "column",
            alignItems: "center",
            padding: "unset",
            
        }}>
            <Nav style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                maxWidth: "100%", 
                color: "#5c6096",
                marginTop: "10.5vh",
                width: "77%"
            }}>
                <div className="my-music">
                    <div className="my-music-title">Dashboard</div>

                    <MyMusicOption name="Home" redirect="/home" icon={HomeIcon}/>
                    <MyMusicOption name="Explore" redirect="/explore" icon={ExploreIcon}/>
                    <MyMusicOption name="Liked Tracks" redirect={"/likedTracks/"+likedTracks.collectionID} icon={FavoriteIcon}/>
                    <MyMusicOption name="Library" redirect="/home" icon={LibraryIcon}/>

                </div>
                </Nav>
                <Nav style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    maxWidth: "100%", 
                    color: "#5c6096",
                    marginTop: "7vh"
                }}>
                    <div className="my-playlists">
                        <div className="title-container">
                            <div style={{padding: "8px", paddingRight: "3px"}}>Your Collections</div>
                            <AddButton handleClick={() => handleAddCollection(props.user.email, "New Collection")}/>
                        </div>
                        {collections?.map(renderCollections)}
                        <div className="title-container">
                            <div style={{padding: "8px", paddingRight: "3px"}}>Daily Mixes</div>
                            <AddButton handleClick={() => handleAddSubList(props.user.email, "New sublist")}/>
                        </div>
                        {subLists?.map(renderSubLists)}
                    </div>
                </Nav>
            
                <style jsx>
                {`
                    .my-music{
                        display: flex; 
                        flex-direction: column;
                        justify-content: flex-start;
                        width: 100%;
                        
                    }
                    .my-music-title{
                        font-size: 24px;
                        font-family: Lato, sans-serif;
                        color: white;
                        margin-bottom: 2.6vh;
                        padding-left: 9.4%; 

                    }
                    .title-container{
                        display: flex;
                        align-items: center;
                    }
                    .nav-link{
                        color: #5c6096;
                    }
                `}
                </style>
        </Navbar>
    )

}

export default Sidebar