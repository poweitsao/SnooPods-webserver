import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Image, Dropdown } from 'react-bootstrap/'
import React, { useState, useEffect } from "react"
import ProfilePicMenu from "./ProfilePicMenu"
import { useGoogleLogout, GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../lib/constants"
import Router from "next/router"
import useWindowDimensions from "./hooks/useWindowDimensions"
import Collapse from 'react-bootstrap/Collapse'
import store from "../redux/store"
import { emptyAudioStore, emptyRegisterationInfo, storeRegisterationInfo } from "../redux/actions/index"

import GoogleLogin from 'react-google-login';
import { Divider } from '@material-ui/core';

import Cookie from "js-cookie"
import isEmpty from '../lib/isEmptyObject';
import { emptyQueue } from '../redux/actions/queueActions';
import {emptyUserSessionInfo} from "../redux/actions/userSessionActions"
import {emptyCollections} from "../redux/actions/collectionActions"
import {emptyLikedTracks} from "../redux/actions/likedTracksActions"
import {emptySubLists} from "../redux/actions/SubListActions"


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

// const ProfilePicToggle = React.forwardRef(({ children, onClick }, ref) => (
//     <div>
//         {/* <img
//             src="/logo.svg"
//             width="30"
//             height="30"
//             className="d-inline-block align-top"
//             alt="React Bootstrap logo"
//           /> */}
//         <a
//             href=""
//             ref={ref}
//             onClick={(e) => {
//                 e.preventDefault();
//                 onClick(e);
//             }}
//         >
//             {children}
//         &#x25bc;
//       </a>
//     </div>
// ));

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Nav.Link 
        style={{ paddingLeft: "unset" }} 
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

const ProfilePicGroup = (props) => {
    return (
        <div className="profile-pic-group" >
            <Nav style={{ whiteSpace: "nowrap" }}>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems:"center"}}>
                    <div className="settings-icon" style={{height:"15px", width: "15px", color: "white"}}></div>
                    <Dropdown
                        
                        // title={props.user.firstName}
                        // title={
                        //     <span className=" my-auto" style={{color:"#5c6096"}}>{props.user.firstName + "▼"}</span>
                        // }
                        id="basic-nav-dropdown"
                        renderMenuOnMount={true}
                        alignRight
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            color:"#5c6096"
                        }}>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                            <div style={{color: "#5c6096"}}>
                                {props.user.firstName}
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
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
                                cookiePolicy={'single_host_origin'}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                    <Image src={props.user.pictureURL}
                        roundedCircle
                        style={{
                            width: "40px", height: "40px",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "flex-start"
                        }} />
                </div>
            </Nav>
        </div >
    )
}

const LoginGroup = (props) => {

    return (
        // <div>
        //     <Nav style={{ whiteSpace: "nowrap" }}>

        <Nav style={{ whiteSpace: "nowrap" }}>
            <NavDropdown
                title="Login"
                // id="basic-nav-dropdown"
                renderMenuOnMount={true}
                alignRight
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: props.paddingLeft
                }}>

                <GoogleLogin
                    clientId={CLIENT_ID}
                    render={renderProps => (
                        <Nav>
                            <NavDropdown.Item
                                style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-around"
                                }}
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}>
                                <img
                                    src={"https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png"}
                                    width="20" height="20"></img>
                                <div style={{ paddingLeft: "10px" }}>Sign In with Google</div>
                            </NavDropdown.Item>
                        </Nav>

                    )}
                    buttonText="Sign In with Google"
                    onSuccess={onGoogleLoginSuccess}
                    onFailure={onGoogleLoginFailed}
                    cookiePolicy={'single_host_origin'}
                />
            </NavDropdown>
        </Nav>
    )
}

async function onGoogleLoginSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    let response = await fetch("/api/user/verifyGoogleSession/" + id_token, { method: "GET" }, { revalidateOnMount: false })
    if (response.status == 200) {
        let res = await response.json()
        if (res.registered) {
            //store session_id
            Cookie.set("session_id", res.session_id)
            Cookie.set("email", res.verification.payload.email)

            console.log("Taking user to their homepage")
            Router.push('/home')
        }
        else if (!res.registered) {
            // res.userID = id_token
            console.log("response in index.js", res)
            // const store = createStore(registerReducer)

            store.dispatch(storeRegisterationInfo(res))
            // console.log("store: ", store.getState())
            console.log("Taking user to registeration page ")
            Router.push('/register')
        }
    }
    else {
        console.log("Login Failed")
    }
}

const onGoogleLoginFailed = (response) => {
    console.log("Google login failed", response)
}

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

            <Collapse id="basic-navbar-nav" in={open}>
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
            padding: "unset",
            
            }}>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse id="responsive-navbar-nav" style={{backgroundColor:"#131538"}}>
                <Nav 
                    className="m-auto" 
                    style={{fontFamily:"font-family: Lato, sans-serif", 
                            fontSize:"18px",
                            display: "flex", 
                            alignItems:"center"}}>
                        {/* <Navbar.Brand style={{ cursor: "pointer", marginRight: "0", fontSize: 30 }} onClick={() => { Router.push("/home") }}>SnooPods</Navbar.Brand> */}
                        <div className="prev-next-buttons" style={{display: "flex"}}>
                            <div style={{borderRadius:"50%", width: "22px", height:"22px", backgroundColor: "white"}}></div>
                            <div style={{borderRadius:"50%", width: "22px", height:"22px", backgroundColor: "white"}}></div>
                        </div>
                        <div>
                            {/* <input style={{borderRadius:"25px", width: "288px", height:"32px", backgroundColor: "white"}}></input> */}
                            <input type="text" class="rounded-input" style={{borderRadius:"25px", width: "288px", height:"32px"}}></input>
                            <style>
                                {`
                                    .rounded-input {
                                        border: 1px solid #ccc;
                                        -moz-border-radius: 25px;
                                        -webkit-border-radius: 25px;
                                        border-radius: 25px;
                                        font-size: 20px;
                                        padding: 4px 7px;
                                        outline: 0;
                                        -webkit-appearance: none;
                                    }
                                    .rounded-input:focus {
                                        border-color: #339933;
                                    }
                                `}
                            </style>
                        </div>
                        
                        <Nav.Link style={{ padding: "unset", color:"#5c6096" }} onClick={() => { Router.push("/queue") }}>Queue</Nav.Link>
                        <Nav.Link style={{ padding: "unset", color:"#5c6096" }} onClick={() => { Router.push("/history") }}>History</Nav.Link>
                        <Nav.Link style={{ padding: "unset", color:"#5c6096" }} onClick={() => { Router.push("/library") }}>Library</Nav.Link>

                        {/* <Nav.Link style={{ paddingLeft: "20px", paddingRight: "28px" }} onClick={() => { Router.push("/about") }}>About</Nav.Link> */}

                        {/* <Divider orientation="vertical" flexItem={true} /> */}
                        <div style={{ marginRight: "auto"}}>
                            {props.user && !isEmpty(props.user)
                                ?<ProfilePicGroup user={props.user} />
                                :<LoginGroup paddingLeft="0px" />
                            }
                        </div>
                    </Nav>

            </Navbar.Collapse>
        </Navbar>)
}

const NavBarContent = (props) => {
    const { height, width } = useWindowDimensions();
    // console.log("props in navbarcontent", props)
    if (width <= 991) {
        return (
            <MobileNavBar user={props.user} />
        )
    }
    else {
        return (
            <DesktopNavBar user={props.user} />
        )
    }

}

class ExploreNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.user
    }



    render() {
        return (
            // dropdown customization: https://react-bootstrap.github.io/components/dropdowns/
            <div style={{ width: "100%", height: "8.69%" }}>
                {/* <div style={{ display: "flex", justifyContent: "space-around" }}> */}
                <NavBarContent user={this.state} />



                <style jsx> {`
                .parent{
                    display:flex;   
                }
                .navbar-content{
                    display:flex;
                    justify-content:center;
                }
                .navbar-content-container{
                    display:flex;
                    justify-content:center;
                }
                .center-button{
                    padding-left: 10px;
                    padding-right: 10px;
                    padding-top:5px;
                    padding-bottom:5px;

                }
                .brand{
                    margin-left:auto;


                }
                .profile-pic-group{
                    margin-right:auto;
                    display:flex;
                    flex-direction:column;
                }
                .profile-pic-button{
                    padding: unset;
                }
                
                
                `}</style>
            </div >
        )
    }
}

export default ExploreNavbar