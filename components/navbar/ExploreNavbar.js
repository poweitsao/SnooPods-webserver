import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Image, Dropdown } from 'react-bootstrap/'
import React, { useState, useEffect } from "react"
import ProfilePicMenu from "../ProfilePicMenu"
import { useGoogleLogout, GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../../lib/constants"
import Router from "next/router"
import { useRouter } from 'next/router'
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

import ProfilePicGroup from './components/ProfilePicGroup';
import SearchIcon from '@material-ui/icons/Search';

import NextButton from "../buttons/NextButton"
import PrevButton from '../buttons/PrevButton';

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
        }}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Navbar.Brand style={{ cursor: "pointer", marginRight: "0", fontSize: 30 }} >SnooPods</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" aria-expanded={open} onClick={() => { setOpen(!open) }} />

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
    const router = useRouter()
    return (
        <Navbar bg="white" expand="lg" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            paddingLeft: "20px",
            paddingRight: "20px",
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
                        <SearchBar searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm}/>
                        
                        <Nav.Link style={{ padding: "unset", color:"#5c6096", paddingRight: "3.2%" }} onClick={() => { Router.push("/queue") }}>Queue</Nav.Link>
                        <Nav.Link style={{ padding: "unset", color:"#5c6096", paddingRight: "3.2%" }} onClick={() => { Router.push("/history") }}>History</Nav.Link>
                        <Nav.Link style={{ padding: "unset", color:"#5c6096", marginRight:"auto" }} onClick={() => { Router.push("/library") }}>Library</Nav.Link>
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

const NavBarContent = (props) => {
    const { height, width } = useWindowDimensions();
    // console.log("props in navbarcontent", props)
    if (width <= 991) {
        return (
            <MobileNavBar user={props.user} searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm}/>
        )
    }
    else {
        return (
            <DesktopNavBar user={props.user} searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm}/>
        )
    }

}

class ExploreNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...props}
    }



    render() {
        return (
            // dropdown customization: https://react-bootstrap.github.io/components/dropdowns/
            <div style={{ width: "100%", height: "8.7%" }}>
                {/* <div style={{ display: "flex", justifyContent: "space-around" }}> */}
                <NavBarContent user={this.state.user} searchTerm={this.state.searchTerm} setSearchTerm={this.state.setSearchTerm} />



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

const SearchBar = (props) => {
    return(
        <div  style={{height:"80%", paddingLeft:"4.3%", paddingRight: "10.8%", width: "36%"}}>
            <div className="input-parent">
                <SearchIcon />  
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="input-rounded" 
                    style={{borderRadius:"25px"}} 
                    
                    onChange={(e) => props.setSearchTerm(e.target.value)}
                    />
            </div>
            <style>
                {`  
                    .input-parent{
                        display: flex;
                        justify-content: flex-end;
                        border: 1px solid #ccc;
                        -moz-border-radius: 25px;
                        -webkit-border-radius: 25px;
                        border-radius: 25px;
                        font-size: 12px;
                        padding: 4px 7px;
                        outline: 0;
                        -webkit-appearance: none;
                        height: 100%;
                        background-color: white;
                        width: 100%;
                    }
                    .input-rounded {
                        border:none;    
                        height: 100%;
                        width: 90%;
                    }
                    .input-rounded:focus {
                        border: none;
                        outline: none;
                    }
                `}
            </style>
        </div>
    )
}

export default ExploreNavbar