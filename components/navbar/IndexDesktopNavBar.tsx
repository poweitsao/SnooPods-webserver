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
import IndexLoginGroup from "./components/IndexLoginGroup"
import IndexSignUpGroup from "./components/IndexSignUpGroup"

const DesktopNavBar = (props) => {
    const router = useRouter()

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
                            width: "64%",
                            height: "40px"}}>
                        <div className="branding-group" style={{width: "18.54%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", marginRight: "auto"}}>
                            <div className="logo" style={{width: "32.4%", height: "61%", margin: "unset", marginRight: "auto", backgroundColor: "white"}}></div>
                            <div className="name" style={{width: "46.4%", height: "fit-content", fontSize: "1.25vw", color: "white"}}>Snoopods</div>
                        </div>
                        
                        <div className="nav-buttons-group">
                            <Nav.Link className="support" style={{padding: "unset", color: "white", marginRight: "13.48%"}}>Support</Nav.Link>
                            <Nav.Link className="download" style={{padding: "unset", color: "white", marginRight: "13.48%"}}>Download</Nav.Link>
                            <Nav.Link className="about" style={{padding: "unset", color: "white", marginRight: "auto"}}>About</Nav.Link>
                        </div>
                        <div className="divider-container" style={{paddingLeft: "1.86%", paddingRight: "1.86%", width: "fit-content", height: "100%"}}>
                            <Divider orientation="vertical" flexItem={true} style={{backgroundColor: "white", width: "2px", height: "100%"}} />
                        </div>
                        {props.user && !isEmpty(props.user)
                                ?<ProfilePicGroup user={props.user} />
                                :(<div style={{display: "flex"}}>
                                    <IndexLoginGroup paddingLeft="0px" />
                                    <IndexSignUpGroup paddingLeft="0px"/>
                                </div>)
                            }
                        <style>
                            {`
                                .nav-buttons-group{
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    width: 21.6%;
                                }
                            `}
                        </style>




                    </Nav>

            </Navbar.Collapse>
        </Navbar>)
}

export default DesktopNavBar