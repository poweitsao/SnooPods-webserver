import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Image, Dropdown } from 'react-bootstrap/'
import React, { useState, useEffect } from "react"
import ProfilePicMenu from "../ProfilePicMenu"
import { useGoogleLogout, GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../../lib/constants"
import Router from "next/router"
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


const DesktopNavBar = (props) => {
    // console.log("DesktopNavBar props", props)

    return (
        <Navbar bg="white" expand="lg" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            paddingLeft: "20px",
            paddingRight: "20px",
            fontSize: 20,
            height: "100%", 
            padding: "unset"
            }}>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse id="responsive-navbar-nav" >
                <Nav className="m-auto">
                        <Navbar.Brand style={{ cursor: "pointer", marginRight: "0", fontSize: 30 }} onClick={() => { Router.push("/home") }}>SnooPods</Navbar.Brand>
                        <Nav.Link style={{ paddingLeft: "20px" }} onClick={() => { Router.push("/queue") }}>Queue</Nav.Link>
                        <Nav.Link style={{ paddingLeft: "20px" }} onClick={() => { Router.push("/history") }}>History</Nav.Link>
                        <Nav.Link style={{ paddingLeft: "20px" }} onClick={() => { Router.push("/library") }}>Library</Nav.Link>

                        {/* <Nav.Link style={{ paddingLeft: "20px", paddingRight: "28px" }} onClick={() => { Router.push("/about") }}>About</Nav.Link> */}

                        {/* <Divider orientation="vertical" flexItem={true} /> */}
                        <div style={{ marginRight: "auto", paddingLeft: "20px" }}>
                            {props.user && !isEmpty(props.user)
                                ?<ProfilePicGroup user={props.user} />
                                :<LoginGroup paddingLeft="0px" />
                            }
                        </div>
                    </Nav>

            </Navbar.Collapse>
        </Navbar>)
}

export default DesktopNavBar