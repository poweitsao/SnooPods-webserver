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

import CollectionIconOnClick from "../../resources/icons/left/collection/collection_icon_onclick.svg"
import ExploreIconOnClick from "../../resources/icons/left/explore/explore_icon_onclick.svg"
import FavoriteIconOnClick from "../../resources/icons/left/favorite/favorite_icon_onclick.svg"
import HomeIconOnClick from "../../resources/icons/left/home/home_icon_onclick.svg"
import MixIconOnClick from "../../resources/icons/left/mix/mix_icon_onclick.svg"
import LibraryIconOnClick from "../../resources/icons/left/library/library_icon_onclick.svg"

import { SvgIcon } from '@material-ui/core';
import { useRouter } from 'next/router'
import { Favorite } from '@material-ui/icons';




const MyMusicOption = ({redirect, name, icon, onClickIcon}) => {
    const router = useRouter()
    const isCurrentTab = router.asPath == redirect
    var [optionContainerColor, setOptionContainerColor] = useState("none")
    var [textColor, setTextColor] = useState("#5c6096")
    // console.log()
    // const [isHoveringOver, setIsHoveringOver] = useState(false)
    const [iconButton, setIconButton] = useState(<SvgIcon className="my-music-option-icon" component={icon} />)

    // const [currIcon, setCurrIcon] = useState(icon)
    useEffect(() => {
        if (isCurrentTab){
            setOptionContainerColor("#484f8b")
            setTextColor("white")
        } 
    })
    
    console.log(name, "is current tab", isCurrentTab)
    console.log(router.asPath)
    return(
        <div className="my-music-option-container" 
            style={{backgroundColor: optionContainerColor}}
            // onMouseEnter={() => {
            //     setIsHoveringOver(true)
            // }}
            // onMouseLeave={() => {
            //     setIsHoveringOver(false)
            // }}
            onClick={
                () => {
                    setIconButton(<SvgIcon className="my-music-option-icon" component={onClickIcon} />)
                    setTextColor("white")
                }
            }
        >
            {/* <div className="my-music-option-icon"></div> */}
            {isCurrentTab
                ? <SvgIcon className="my-music-option-icon" component={onClickIcon} />
                : iconButton
            }

                <Nav.Link 
                    style={{color: textColor, padding: "unset", paddingLeft: "15.25%%", paddingTop: "9.5px", paddingBottom:"9.5px", width: "100%"}} 
                    onClick={() => { Router.push(redirect) }}>
                    {name}
                </Nav.Link>
            <style>{`
                .my-music-option-container{
                    display: flex;
                    align-items: center;  
                    font-family: Lato, sans-serif;
                    font-size: 0.729vw;
                    padding-left: 9.4%;
                }
                .my-music-option-icon{
                    width: 22px;
                    height: 22px;   
                    fill: none;
                    margin-right: 13.5%;
                }
            `}</style>
        </div>
    )
}

const Sidebar = (props) => {
    // console.log("sidebar pathname", router.pathname)
    
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

    const oldrenderCollections = (collection, index) => {
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
                    ?<DeleteButton width={"1.25vw"} height={"1.25vw"} handleClick={() =>{handleDeleteCollection(email, collectionID, collectionName )}}/>
                    :<div style={{width: "1.25vw", height: "1.25vw"}}></div>}
                    
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

    const oldrenderSubLists = (subList, index) => {
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
                    ?<DeleteButton width={"1.25vw"} height={"1.25vw"} handleClick={() =>{handleDeleteSubList(email, subListID, subListName )}}/>
                    :<div style={{width: "1.25vw", height: "1.25vw"}}></div>}
                    
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

    const CollectionIconElement = ({collectionID, collectionName }) => {
        const router = useRouter()
        const isCurrentTab = router.asPath == "/collection/"+collectionID
        var [color, setColor] = useState("#5c6096")
        var [currIcon, setCurrIcon] = useState(<SvgIcon component={CollectionIcon} style={{fill:"none", marginRight:"13.5%"}}/>)
        useEffect(()=> {
            if (isCurrentTab && color !== "white"){
                setCurrIcon(<SvgIcon component={CollectionIconOnClick} style={{fill:"none", marginRight:"13.5%"}}/>)
                setColor("white")
            }
        }, [isCurrentTab])

        return (
            <div key={collectionID} 
                style={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "100%",
                    paddingLeft:"9.4%", 
                    width: "100%"
                }}
                onClick={() => {
                    // if(!isCurrentTab){
                    setCurrIcon(<SvgIcon component={CollectionIconOnClick} style={{fill:"none", marginRight:"13.5%"}}/>)
                    setColor("white")
                }}
                
            >
                
                <div style={{display: "flex", justifyContent:"center", alignItems:"center", paddingBottom:"18px", width: "100%",}}>
                    {currIcon}
                    {/* {
                        isCurrentTab
                        ? <SvgIcon component={CollectionIcon} style={{fill:"none", marginRight:"15%"}}/>
                        : <SvgIcon component={CollectionIconOnClick} style={{fill:"none", marginRight:"15%"}}/>
                    } */}
                    <Nav.Link
                        style={{ 
                            flex: "1", 
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: color,
                            padding:"unset",
                            fontSize:"0.729vw"
                        }} 
                                            
                        onClick={() => { Router.push("/collection/" + collectionID) 
                    }}>{collectionName}</Nav.Link>
                </div>
            </div>
        )
    }

    const renderCollections = (collection, index) => {
        const collectionName = collection.collectionName
        const collectionID = collection.collectionID

        return(
            <CollectionIconElement key={collectionID} collectionID={collectionID} collectionName={collectionName}/>
        )
    }

    const SubListIconElement = ({subListID, subListName }) => {
        const router = useRouter()
        const isCurrentTab = router.asPath == "/subList/"+subListID
        var [color, setColor] = useState("#5c6096")
        var [currIcon, setCurrIcon] = useState(<div style={{marginRight:"13.5%", width: "19px", height: "0.729vw"}}><SvgIcon component={MixIcon} style={{fill:"none"}}/></div>)
        useEffect(()=> {
            if (isCurrentTab && color !== "white"){
                setCurrIcon(<div style={{marginRight:"13.5%", width: "19px", height: "0.729vw"}}>
                                <SvgIcon component={MixIconOnClick} style={{fill:"none"}}/>
                            </div>)
                setColor("white")
            }
        }, [isCurrentTab])

        return (
            <div key={subListID} 
                style={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "100%",
                    paddingLeft:"9.4%", 
                    width: "100%"
                }}
                onClick={() => {
                    // if(!isCurrentTab){
                    setCurrIcon(<div style={{marginRight:"13.5%", width: "19px", height: "0.729vw"}}>
                                    <SvgIcon component={MixIconOnClick} style={{fill:"none"}}/>
                                </div>)
                    setColor("white")
                }}
                
            >
                
                <div style={{display: "flex", justifyContent:"center", alignItems:"center", paddingBottom:"18px", width: "100%",}}>
                    {currIcon}
                    {/* {
                        isCurrentTab
                        ? <SvgIcon component={CollectionIcon} style={{fill:"none", marginRight:"15%"}}/>
                        : <SvgIcon component={CollectionIconOnClick} style={{fill:"none", marginRight:"15%"}}/>
                    } */}
                    <Nav.Link
                        style={{ 
                            flex: "1", 
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: color,
                            padding:"unset",
                            fontSize:"0.729vw"
                        }} 
                                            
                        onClick={() => { Router.push("/subList/" + subListID) 
                    }}>{subListName}</Nav.Link>
                </div>
            </div>
        )
    }

    const renderSubLists = (subList, index) => {
        const subListID = subList.subscriptionListID
        const subListName = subList.subscriptionListName
        return(
            <SubListIconElement key={subListID} subListID={subListID} subListName={subListName}/>
        )
        const router = useRouter()
        const isCurrentTab = router.asPath == "sublist/"+subListID
        return(
            <div key={subListID} style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: "100%",
                paddingLeft:"9.4%"}}
                >
                <div style={{display: "flex", justifyContent:"center", alignItems:"center", paddingBottom:"18px", width: "100%"}}>
                    <div style={{marginRight:"15%", width:"19px", height:"14px"}}>
                        <SvgIcon component={MixIcon} style={{fill:"none"}}/>
                    </div>
                    <Nav.Link
                        style={{ 
                            flex: "1", 
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            "color": "#5c6096",
                            padding:"unset",
                            fontSize:"14px"

                            }} 
                                            
                        onClick={()=> {Router.push("/subList/"+subList.subscriptionListID)}}>
                        {subListName}
                    </Nav.Link>
                </div>
            </div>
        )
    }

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
            overflowY: "scroll",
            fontFamily:"Lato, sans-serif"
            
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
                    <div className="my-music-title">My Music</div>

                    <MyMusicOption name="Home" redirect="/home" icon={HomeIcon} onClickIcon={HomeIconOnClick}/>
                    <MyMusicOption name="Explore" redirect="/explore" icon={ExploreIcon} onClickIcon={ExploreIconOnClick}/>
                    <MyMusicOption name="Favorites" redirect={"/likedTracks/"+likedTracks.collectionID} icon={FavoriteIcon} onClickIcon={FavoriteIconOnClick}/>
                    <MyMusicOption name="Library" redirect="/library" icon={LibraryIcon} onClickIcon={LibraryIconOnClick}/>

                </div>
                </Nav>
                <Nav style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    maxWidth: "100%", 
                    color: "#5c6096",
                    marginTop: "7vh",
                    width: "77%"
                }}>
                    <div className="my-playlists" style={{width: "100%"}}>
                        <div className="title-container">
                            <div style={{padding: "unset", paddingLeft:"9.4%", fontSize:"1.25vw", color:"white"}}>Collections</div>
                            <div style={{width: "fit-content", height: "fit-content", paddingLeft: "7.2%"}}>
                                <AddButton style={{padding:"unset", paddingLeft:"12%"}} handleClick={() => handleAddSubList(props.user.email, "New Mix")}/>
                            </div>                        
                        </div>
                        {/* {collections?.map(renderCollections)}
                        <div className="title-container">
                            <div style={{padding: "8px", paddingRight: "3px"}}>Daily Mixes</div>
                            <AddButton handleClick={() => handleAddSubList(props.user.email, "New sublist")}/>
                        </div>
                        {subLists?.map(renderSubLists)} */}
                        {collections?.map(renderCollections)}
                    </div>
                    

                </Nav>
                <Nav style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    maxWidth: "100%", 
                    color: "#5c6096",
                    marginTop: "7vh",
                    width: "77%"
                }}>
                    <div className="my-playlists" style={{width: "100%"}}>
                        <div className="title-container">
                            <div style={{padding: "unset", paddingLeft:"9.4%", fontSize:"1.25vw", color:"white"}}>Mixes</div>
                            <div style={{width: "fit-content", height: "fit-content", paddingLeft: "7.2%"}}>
                                <AddButton style={{padding:"unset", paddingLeft:"12%"}} handleClick={() => handleAddSubList(props.user.email, "New Mix")}/>
                            </div>
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
                        font-size: 1.25vw;
                        font-weight: bold;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: normal;
                        letter-spacing: 1px;
                        font-family: Lato;
                        color: white;
                        margin-bottom: 13.8%;
                        padding-left: 9.4%; 

                    }
                    .title-container{
                        display: flex;
                        align-items: center;
                        margin-bottom: 13.8%;
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