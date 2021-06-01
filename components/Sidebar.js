import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from "react-bootstrap"
import { server } from '../config';
import fetch from "isomorphic-unfetch";
import isEmpty from '../lib/isEmptyObject';
import useSWR, {trigger} from 'swr';
import AddButton from "./buttons/AddButton"
import DeleteButton from "./buttons/DeleteButton"
import Router from "next/router"
import store from '../redux/store';
import {storeLikedTracks} from "../redux/actions/likedTracksActions"

const Sidebar = (props) => {
    const [mounted, setMounted] = useState(false)
    const [showCollectionDelete, setShowCollectionDelete] = useState([])
    const [showSubListDelete, setshowSubListDelete] = useState([])

    const [email, setEmail] = useState(props.user.email)
    const {data: collections} = useSWR("/api/user/collections/getCollections/"+ props.user.email)
    // const collections = []
    const {data: likedTracks} = useSWR("/api/user/collections/likedTracks/get/"+ props.user.email)

    const {data: subLists} = useSWR("/api/user/sublists/getSubLists/"+ props.user.email)

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

      }, [collections, likedTracks]);

    if(!collections){
        return <div className="sidebar" style={{
                backgroundColor: "#EAECEF",
                width: "14%",
                flexDirection: "column",
                alignItems: "center",
            }}></div>
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
                        whiteSpace: "nowrap"
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
                        whiteSpace: "nowrap"
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
            backgroundColor: "#EAECEF",
            width: "14%",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Nav style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                maxWidth: "100%", 
            }}>
                <Nav.Link style={{  }} onClick={() => { Router.push("/home") }}>Home</Nav.Link>
                <Nav.Link style={{  }} onClick={() => { Router.push("/") }}>Search</Nav.Link>
                <Nav.Link style={{  }} onClick={() => { Router.push("/likedTracks/"+likedTracks.collectionID) }}>Liked Tracks</Nav.Link>

                <div className="title-container">
                    <div style={{padding: "8px", paddingRight: "3px"}}>Your Collections</div>
                    <AddButton handleClick={() => handleAddCollection(props.user.email, "New Collection")}/>
                </div>
                {collections?.map(renderCollections)}
                <div className="title-container">
                    <div style={{padding: "8px", paddingRight: "3px"}}>Subscription Lists</div>
                    <AddButton handleClick={() => handleAddSubList(props.user.email, "New sublist")}/>
                </div>
                {subLists?.map(renderSubLists)}
            </Nav>
                <style jsx>
                {`
                    .title-container{
                        display: flex;
                        align-items: center;
                    }
                `}
                </style>
        </Navbar>
    )

}

export default Sidebar