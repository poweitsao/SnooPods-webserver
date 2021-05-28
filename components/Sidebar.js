import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from "react-bootstrap"
import { server } from '../config';
import fetch from "isomorphic-unfetch";
import isEmpty from '../lib/isEmptyObject';
import useSWR, {trigger} from 'swr';
import AddButton from "./buttons/AddButton"
import DeleteButton from "./buttons/DeleteButton"
import Router from "next/router"
import { LikedTracksStore } from '../redux/store';
import {storeLikedTracks} from "../redux/actions/likedTracksActions"

const Sidebar = (props) => {
    const [mounted, setMounted] = useState(false)
    const [showDelete, setShowDelete] = useState([])
    const [email, setEmail] = useState(props.user.email)
    const {data: collections} = useSWR("/api/user/collections/getCollections/"+ props.user.email)
    const {data: likedTracks} = useSWR("/api/user/collections/likedTracks/get/"+ props.user.email)


    useEffect(() => {
        setMounted(true)

        if (collections !== undefined){
            if (collections.length !== showDelete.length){
                setShowDelete([...Array(collections.length)].map((_, i) => false))
            }
        }
        if(likedTracks){
            LikedTracksStore.dispatch({
                type: "STORE_LIKED_TRACKS",
                likedTracks: likedTracks.tracks
            })
            console.log("likedTracks", LikedTracksStore.getState())
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
                    let array = showDelete.map((item, itemIndex) => {
                        if (itemIndex == index){
                            return true
                        } else{
                            return false
                        }
                    })
                    setShowDelete(array)
                }}
                onMouseLeave={() => {
                    let array = showDelete.map((item, itemIndex) => {
                        return false
                    })
                    setShowDelete(array)
                }}
                >
                {showDelete[index]
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
        console.log("delete collection clicked")
        console.log(email)
        console.log(collectionID)
        console.log(collectionName)

        await fetch("/api/user/collections/deleteCollection/", {
            method: "DELETE", body: JSON.stringify({email: email, collectionID: collectionID, collectionName: collectionName})
        })
        trigger("/api/user/collections/getCollections/"+email)
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
                <div className="your-collections-title-container">
                    <div style={{padding: "8px", paddingRight: "3px"}}>Your Collections</div>
                    <AddButton handleClick={() => handleAddCollection(props.user.email, "New Collection")}/>
                </div>
                {collections?.map(renderCollections)}
            </Nav>
                <style jsx>
                {`
                    .your-collections-title-container{
                        display: flex;
                        align-items: center;
                    }
                `}
                </style>
        </Navbar>
    )

}

export default Sidebar