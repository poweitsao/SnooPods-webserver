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

const MobileNavBar = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <Navbar bg="white" expand="lg" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            paddingLeft: "20px",
            paddingRight: "20px",
            fontSize: 20
        }}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Navbar.Brand style={{ cursor: "pointer", marginRight: "0", fontSize: 30 }} >SnooPods</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" aria-expanded={open} onClick={() => { setOpen(!open) }} />

                {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
            </div>

            <Collapse in={open}>
                <div>
                    <Nav className="m-auto">

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <div className="center-button">
                                <Nav.Link style={{ paddingLeft: "50px" }} onClick={() => { Router.push("/home") }}>Home</Nav.Link>
                                <Nav.Link style={{ paddingLeft: "50px" }} onClick={() => { Router.push("/queue") }}>Queue</Nav.Link>
                                <Nav.Link style={{ paddingLeft: "50px" }} onClick={() => { Router.push("/history") }}>History</Nav.Link>
                                <Nav.Link style={{ paddingLeft: "50px" }} onClick={() => { Router.push("/about") }}>About</Nav.Link>

                            </div>
                            {/* <NavDropdown
                            title={props.user.firstName}
                            id="basic-nav-dropdown"
                            renderMenuOnMount={true}
                            alignRight
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                            <NavDropdown.Item>
                                Test
                    </NavDropdown.Item>
                        </NavDropdown> */}
                            <div >
                                {props.user
                                    ? <ProfilePicGroup user={props.user} />
                                    : <LoginGroup paddingLeft="50px" />
                                }
                            </div>
                        </div>
                        {/* <div className="center-button">
                        <Nav.Link href="#link">Browse</Nav.Link>
                    </div>
                    <div className="center-button">
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </div> */}
                    </Nav>
                </div>

            </Collapse>
        </Navbar>
    )
}