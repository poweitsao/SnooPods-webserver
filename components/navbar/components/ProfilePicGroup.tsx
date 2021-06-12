import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Image, Dropdown } from 'react-bootstrap/'
import React, { useState, useEffect } from "react"
import ProfilePicMenu from "../../ProfilePicMenu"
import { useGoogleLogout, GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../../../lib/constants"
import Router from "next/router"
import useWindowDimensions from "../../hooks/useWindowDimensions"
import Collapse from 'react-bootstrap/Collapse'
import store from "../../../redux/store"
import { emptyAudioStore, emptyRegisterationInfo, storeRegisterationInfo } from "../../../redux/actions/index"

import GoogleLogin from 'react-google-login';
import { Divider } from '@material-ui/core';

import Cookie from "js-cookie"
import isEmpty from '../../../lib/isEmptyObject';
import { emptyQueue } from '../../../redux/actions/queueActions';
import {emptyUserSessionInfo} from "../../../redux/actions/userSessionActions"
import {emptyCollections} from "../../../redux/actions/collectionActions"
import {emptyLikedTracks} from "../../../redux/actions/likedTracksActions"
import {emptySubLists} from "../../../redux/actions/SubListActions"
const ProfilePicGroup = (props) => {
    return (
        <div className="profile-pic-group">
            <Nav style={{ whiteSpace: "nowrap" }}>
                <div style={{ display: "flex", justifyContent: "flex-start", marginRight: "37px" }}>
                    <Image src={props.user.pictureURL}
                        roundedCircle
                        style={{
                            width: "40px", height: "40px", marginRight: "10px",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "flex-start"
                        }} />
                    <NavDropdown
                        title={props.user.firstName}
                        id="basic-nav-dropdown"
                        renderMenuOnMount={true}
                        alignRight
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "flex-start"
                        }}>
                        {/* <GoogleLogout
                        clientId={CLIENT_ID}
                        render={renderProps => (
                            <NavDropdown.Item onClick={renderProps.onClick} disabled={renderProps.disabled}>Log Out</NavDropdown.Item>
                        )}
                        buttonText="custom logout"
                        onLogoutSuccess={logout}
                        onFailure={logoutFailed}
                        cookiePolicy={'single_host_origin'}
                    /> */}
                        <GoogleLogout
                            clientId={CLIENT_ID}
                            render={renderProps => (
                                <Dropdown.Item
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >Log Out
                                </Dropdown.Item>
                            )}
                            buttonText="custom logout"
                            onLogoutSuccess={logout}
                            onFailure={logoutFailed}
                            // cookiePolicy={'single_host_origin'}
                        />
                    </NavDropdown>
                </div>
            </Nav>
        </div >
    )
}

const logout = () => {
    // console.log("Logout clicked")
    Cookie.remove("session_id")
    Cookie.remove("email")
    store.dispatch(emptyUserSessionInfo())

    store.dispatch(emptyRegisterationInfo())

    store.dispatch(emptyAudioStore())

    store.dispatch(emptyQueue())


    store.dispatch(emptyCollections())

    store.dispatch(emptyLikedTracks())

    store.dispatch(emptySubLists())

    Router.push("/")

}

const logoutFailed = () => {
    console.log("logout failed")
}

export default ProfilePicGroup