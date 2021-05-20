import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from "react-bootstrap"
import { server } from '../config';



const Sidebar = (props) => {
    
    // useEffect(() => {
    //     const res = await fetch(server + "/api/user/getCollections/" + props.userEmail, { method: "GET" })
    //     if (res.status === 200) {

    //     var userCollections = await res.json()
    //     console.log("collections: ", userCollections)
    //     // setFeaturedSubreddits(featured);
    //     } 
    //   }, []);

    return (
        <Navbar className="sidebar" style={{
            backgroundColor: "#EAECEF",
            width: "14%",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Nav style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                maxWidth: "100%", 
            }}>
                <Nav.Link style={{  }} onClick={() => { Router.push("/") }}>Home</Nav.Link>
                <Nav.Link style={{  }} onClick={() => { Router.push("/") }}>Search</Nav.Link>
                <div style={{padding: "8px"}}>Your Collections</div>
                <Nav.Link style={{ paddingLeft: "25px", maxWidth: "100%",flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} onClick={() => { Router.push("/") }}>Collection 1234567678</Nav.Link>
                <Nav.Link style={{ paddingLeft: "25px", maxWidth: "100%",flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} onClick={() => { Router.push("/") }}>Collection2131312312</Nav.Link>

            </Nav>
                <style jsx>
                {``}
                </style>
        </Navbar>
    )

}

// Sidebar.getInitialProps = async () =>{
    
// }

export default Sidebar