import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Image, Dropdown } from 'react-bootstrap/'
import React from "react"
import store from "../redux/store"
import ProfilePicMenu from "../components/ProfilePicMenu"
import { useGoogleLogout, GoogleLogout } from 'react-google-login';
import { CLIENT_ID } from "../lib/constants"
import Router from "next/router"

// const Navbar = (props) => {


// }

// export default Navbar;


// import { Row, Col, Form } from 'react-bootstrap/'
// // import Col from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'
// import React, { useState } from 'react';
// import Router from "next/router"
// import store from "../redux/store"
import Cookie from "js-cookie"

const logout = () => {
    // console.log("Logout clicked")
    Cookie.remove("session_id")
    Cookie.remove("email")
    Router.push("/")

}
const logoutFailed = () => {
    console.log("logout failed")
}

class CustomNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.user
    }



    render() {
        return (
            // dropdown customization: https://react-bootstrap.github.io/components/dropdowns/
            <div>
                <Navbar bg="light" expand="lg" fixed="top" >

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <div className="brand">
                            <Navbar.Brand href="#home">Listen To Reddit</Navbar.Brand>
                        </div>
                        <Nav className="m-auto">


                            <div className="center-button">
                                <Nav.Link onClick={() => { console.log("click") }}>Home</Nav.Link>
                            </div>
                            <div className="center-button">
                                <Nav.Link href="#link">Link</Nav.Link>
                            </div>
                            <div className="center-button">
                                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                </NavDropdown>
                            </div>
                        </Nav>
                        {/* <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form> */}

                        <div className="profile-pic-group">
                            {/* <Button roundedCircle></Button> */}
                            {/* <ProfilePicMenu picture_url={this.state.picture_url} /> */}
                            <Nav style={{ whiteSpace: "nowrap" }}>
                                <Image src={this.state.picture_url} roundedCircle style={{ width: "40px", height: "40px" }} />
                                <NavDropdown title={this.state.firstName} id="basic-nav-dropdown">
                                    {/* <NavDropdown.Item onClick={(CLIENT_ID) => { useGoogleLogout({ client_id: CLIENT_ID, onLogoutSuccess: logout, onFailure: logoutFailed }) }}>Log Out</NavDropdown.Item> */}
                                    <GoogleLogout
                                        clientId={CLIENT_ID}
                                        render={renderProps => (
                                            <NavDropdown.Item onClick={renderProps.onClick} disabled={renderProps.disabled}>Log Out</NavDropdown.Item>
                                            // <button onClick={logout} disabled={renderProps.disabled}>This is my custom Google button</button>
                                        )}
                                        buttonText="custom logout"
                                        onLogoutSuccess={logout}
                                        onFailure={logoutFailed}
                                        cookiePolicy={'single_host_origin'}
                                    />

                                    <NavDropdown.Item >Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>

                            {/* <Dropdown title="">
                                <Dropdown.Toggle className="profile-pic-button">
                                    <Image src={this.state.picture_url} roundedCircle fluid />

                                </Dropdown.Toggle>


                                <Dropdown.Menu>
                                    <Dropdown.Item href="#action/3.2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#action/3.3">Something</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#action/3.4">Separated link</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}

                            {/* <button className="btn profile-pic-button">
                                <Image src={this.state.picture_url} roundedCircle fluid /></button> */}
                        </div>
                        {/* <img src={this.state.picture_url} className="profile-pic-button" onClick={() => { }} /> */}

                    </Navbar.Collapse>
                </Navbar>
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
                }
                .profile-pic-button{
                    padding: unset;
                }
                
                
                `}</style>
            </div >
        )
    }
}

export default CustomNavbar