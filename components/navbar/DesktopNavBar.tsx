import { Navbar, Nav } from 'react-bootstrap/'
import React from "react"
import Router, { useRouter } from "next/router"
import isEmpty from '../../lib/isEmptyObject';
import ProfilePicGroup from "./components/ProfilePicGroup"
import LoginGroup from "./components/LoginGroup"
import PrevButton from '../buttons/PrevButton';
import NextButton from '../buttons/NextButton';

const DesktopNavBar = (props) => {
    const router = useRouter()
    console.log("router stuff", router.asPath)

    return (
        <Navbar bg="white" expand="lg" style={{
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
                            fontSize:"min(0.9375vw, 18px)",
                            display: "flex", 
                            alignItems:"center",
                            justifyContent:"center",
                            width: "min(88.6%, 1468px)",
                            height: "40px"}}>
                        <PrevButton style={{marginRight: "12px"}} handleClick={router.back} />
                        <NextButton handleClick={() => {window.history.forward();}}/>
                        <div  style={{height:"80%", paddingLeft:"4.3%", paddingRight: "10.8%", width: "36%"}}></div>
                        
                        <Nav.Link style={{ padding: "unset", color: (router.asPath == "/queue")? "white": "#5c6096", paddingRight: "3.2%" }} onClick={() => { Router.push("/queue") }}>Queue</Nav.Link>
                        <Nav.Link style={{ padding: "unset", color: (router.asPath == "/history")? "white": "#5c6096", paddingRight: "3.2%" }} onClick={() => { Router.push("/history") }}>History</Nav.Link>
                        <Nav.Link style={{ padding: "unset", color: (router.asPath == "/library")? "white": "#5c6096", marginRight:"auto" }} onClick={() => { Router.push("/library") }}>Library</Nav.Link>

                        {props.user && !isEmpty(props.user)
                            ?<ProfilePicGroup user={props.user} />
                            :<LoginGroup paddingLeft="0px" />
                        }
                    </Nav>

            </Navbar.Collapse>
        </Navbar>)
}

export default DesktopNavBar