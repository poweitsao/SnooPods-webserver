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
        <div className="profile-pic-group"
            style={{ display: "flex", justifyContent: "flex-end", alignItems:"center", height: "100%", width: "14%"}} >
            <div style={{paddingRight: "11.1%"}}>
                <div className="settings-icon" style={{height:"15px", width: "15px", backgroundColor: "white", marginRight: "11.1%"}}></div>
            </div>
            <Dropdown
                id="basic-nav-dropdown"
                alignRight
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    color:"#5c6096"
                }}>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    <div style={{color: "#5c6096", marginRight: "20px"}}>
                        {props.user.firstName}
                    </div>
                    <div style={{color: "#5c6096", height: "8px", marginRight: "18px"}}>▼</div>
                </Dropdown.Toggle>

                <Dropdown.Menu renderOnMount={true}>
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
                    />
                </Dropdown.Menu>
            </Dropdown>
            <Image src={props.user.pictureURL}
                roundedCircle
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "flex-start"
                }} />
        </div >
    )
}

type Props = {
    onClick: (e) => void
  }

const CustomToggle = React.forwardRef<any, Props>(({ children, onClick }, ref) => (
    <Nav.Link 
        style={{ padding: "unset", display: "flex" }} 
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
      {children}
      
    </Nav.Link>
  ));


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