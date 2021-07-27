import React, { useState, useEffect } from "react"
import useWindowDimensions from "../hooks/useWindowDimensions"

import MobileNavBar from "./MobileNavBar"
import IndexDesktopNavBar from "./IndexDesktopNavBar"


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
            <IndexDesktopNavBar user={props.user} />
        )
    }

}

class CustomNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.user
    }



    render() {
        return (
            // dropdown customization: https://react-bootstrap.github.io/components/dropdowns/
            <div style={{ width: "100%", height: "100%" }}>
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

export default CustomNavbar