import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Image, Dropdown } from 'react-bootstrap/'
import React, { useState, useEffect } from "react"
import ProfilePicMenu from "../ProfilePicMenu"
import { useGoogleLogout, GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../../lib/constants"
import Router, { useRouter } from "next/router"
import useWindowDimensions from "../hooks/useWindowDimensions"
import Collapse from 'react-bootstrap/Collapse'
import store from "../../redux/store"
import { emptyAudioStore, emptyRegisterationInfo, storeRegisterationInfo } from "../../redux/actions/index"

import GoogleLogin from 'react-google-login';
import { Divider } from '@material-ui/core';

import Cookie from "js-cookie"
import isEmpty from '../../lib/isEmptyObject';
import { emptyQueue } from '../../redux/actions/queueActions';
import {emptyUserSessionInfo} from "../../redux/actions/userSessionActions"
import {emptyCollections} from "../../redux/actions/collectionActions"
import {emptyLikedTracks} from "../../redux/actions/likedTracksActions"
import {emptySubLists} from "../../redux/actions/SubListActions"

import ProfilePicGroup from "./components/ProfilePicGroup"
import LoginGroup from "./components/LoginGroup"
import PrevButton from '../buttons/PrevButton';
import NextButton from '../buttons/NextButton';


// const DesktopNavBar = (props) => {
//     // console.log("DesktopNavBar props", props)

//     return (
//         <Navbar bg="white" expand="lg" style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "stretch",
//             paddingLeft: "20px",
//             paddingRight: "20px",
//             fontSize: 20,
//             height: "100%", 
//             padding: "unset"
//             }}>

//             <Navbar.Toggle aria-controls="responsive-navbar-nav" />

//             <Navbar.Collapse id="responsive-navbar-nav" >
//                 <Nav className="m-auto">
//                         <Navbar.Brand style={{ cursor: "pointer", marginRight: "0", fontSize: 30 }} onClick={() => { Router.push("/home") }}>SnooPods</Navbar.Brand>
//                         <Nav.Link style={{ paddingLeft: "20px" }} onClick={() => { Router.push("/queue") }}>Queue</Nav.Link>
//                         <Nav.Link style={{ paddingLeft: "20px" }} onClick={() => { Router.push("/history") }}>History</Nav.Link>
//                         <Nav.Link style={{ paddingLeft: "20px" }} onClick={() => { Router.push("/library") }}>Library</Nav.Link>

//                         {/* <Nav.Link style={{ paddingLeft: "20px", paddingRight: "28px" }} onClick={() => { Router.push("/about") }}>About</Nav.Link> */}

//                         {/* <Divider orientation="vertical" flexItem={true} /> */}
//                         <div style={{ marginRight: "auto", paddingLeft: "20px" }}>
//                             {props.user && !isEmpty(props.user)
//                                 ?<ProfilePicGroup user={props.user} />
//                                 :<LoginGroup paddingLeft="0px" />
//                             }
//                         </div>
//                     </Nav>

//             </Navbar.Collapse>
//         </Navbar>)
// }

const DesktopNavBar = (props) => {
    // console.log("DesktopNavBar props", props)
    const router = useRouter()
    console.log("router stuff", router.asPath)

    return (
        <Navbar bg="white" expand="lg" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            paddingLeft: "20px",
            paddingRight: "20px",
            fontSize: 20,
            height: "100%", 
            padding: "unset",
            
            }}>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse 
                id="responsive-navbar-nav" 
                style={{
                    backgroundColor:"#131538",
                    justifyContent: "center"
                    }}>
                <Nav 
                    style={{fontFamily:"font-family: Lato, sans-serif", 
                            fontSize:"0.9375vw",
                            display: "flex", 
                            alignItems:"center",
                            justifyContent:"center",
                            width: "88.6%",
                            height: "40px"}}>
                        {/* <Navbar.Brand style={{ cursor: "pointer", marginRight: "0", fontSize: 30 }} onClick={() => { Router.push("/home") }}>SnooPods</Navbar.Brand> */}
                        {/* <div
                            className="prev-next-buttons" 
                            style={{display: "flex", width:"3.8%"}}>
                        
                        </div> */}
                        <PrevButton style={{marginRight: "12px"}} handleClick={router.back} />
                        {/* <div style={{borderRadius:"50%", width: "22px", height:"22px", backgroundColor: "white", marginRight: "12px"}}></div> */}
                        <NextButton handleClick={() => {window.history.forward();}}/>
                        
                        {/* <div style={{borderRadius:"50%", width: "22px", height:"22px", backgroundColor: "white"}}></div> */}
                        {/* <SearchBar searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm}/> */}
                        <div  style={{height:"80%", paddingLeft:"4.3%", paddingRight: "10.8%", width: "36%"}}></div>
                        
                        <Nav.Link style={{ padding: "unset", color: (router.asPath == "/queue")? "white": "#5c6096", paddingRight: "3.2%" }} onClick={() => { Router.push("/queue") }}>Queue</Nav.Link>
                        <Nav.Link style={{ padding: "unset", color: (router.asPath == "/history")? "white": "#5c6096", paddingRight: "3.2%" }} onClick={() => { Router.push("/history") }}>History</Nav.Link>
                        <Nav.Link style={{ padding: "unset", color: (router.asPath == "/library")? "white": "#5c6096", marginRight:"auto" }} onClick={() => { Router.push("/library") }}>Library</Nav.Link>
                        {/* <Nav.Link style={{ paddingLeft: "20px", paddingRight: "28px" }} onClick={() => { Router.push("/about") }}>About</Nav.Link> */}

                        {/* <Divider orientation="vertical" flexItem={true} /> */}
                        {/* <div style={{   }}> */}
                        {props.user && !isEmpty(props.user)
                            ?<ProfilePicGroup user={props.user} />
                            :<LoginGroup paddingLeft="0px" />
                        }
                        {/* </div> */}
                    </Nav>

            </Navbar.Collapse>
        </Navbar>)
}

export default DesktopNavBar