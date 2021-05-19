// import { Row, Col, Form } from 'react-bootstrap/'
// // import Col from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'
import React, { useState } from 'react';
// import Router from "next/router"
// import { RegisterStore } from "../redux/store"
// import Cookie from "js-cookie"
import { Navbar, Nav } from "react-bootstrap"


class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { firstName: "", lastName: "", email: "" };
        // this.handleInputChange = this.handleInputChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            
            
            <Navbar className="sidebar" style={{
                backgroundColor: "#EAECEF",
                width: "14%",
                flexDirection: "column",
                alignItems: "center",
                // flexWrap: "wrap"
            }}>
                <Nav style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    // flexWrap: "wrap",
                    maxWidth: "100%",
                    
                    
                    
                }}>
                    <Nav.Link style={{  }} onClick={() => { Router.push("/") }}>Home</Nav.Link>
                    <Nav.Link style={{  }} onClick={() => { Router.push("/") }}>Search</Nav.Link>
                    <Nav.Link style={{  }} onClick={() => { Router.push("/") }}>Your Collections</Nav.Link>
                    <Nav.Link style={{ paddingLeft: "25px", maxWidth: "100%",flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} onClick={() => { Router.push("/") }}>Collection 1234567678</Nav.Link>
                    <Nav.Link style={{ paddingLeft: "25px", maxWidth: "100%",flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} onClick={() => { Router.push("/") }}>Collection2131312312</Nav.Link>


                </Nav>
                    <style jsx>
                    {`
                    `}
                    </style>
            </Navbar>
                
            
        )
    }
}

export default Sidebar