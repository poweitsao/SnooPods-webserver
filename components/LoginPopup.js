import Modal from 'react-bootstrap/Modal'
import { GoogleLogin } from 'react-google-login';
import { CLIENT_ID } from "../lib/constants"
import Button from "react-bootstrap/Button"
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import Cookie from "js-cookie"
import {useState} from "react"
import useWindowDimensions from "./hooks/useWindowDimensions"
import Image from "react-bootstrap/Image";
import logo from "../public/images/logo.png"




async function onGoogleLoginSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    let response = await fetch("/api/user/verifyGoogleSession/" + id_token, { method: "GET" }, { revalidateOnMount: false })
    if (response.status == 200) {
        let res = await response.json()
        if (res.registered) {
            //store session_id
            Cookie.set("session_id", res.session_id)
            Cookie.set("email", res.verification.payload.email)

            Router.reload()
        }
        else if (!res.registered) {
            store.dispatch(storeRegisterationInfo(res))
            Router.push('/register')
        }
    }
    else {
        console.log("Login Failed")
    }
}

const onGoogleLoginFailed = (response) => {

}

const LoginPopup = (props) => {
    const { height, width } = useWindowDimensions();
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            // size="lg"
            // style={{maxWidth: width}}
            dialogClassName="my-modal"
            backdrop="static"            
        >
             <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"/>
            {/* <Modal.Header closeButton style={{width: width, height: height}}style={{width: width, height: height}}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Please sign in to continue.
                </Modal.Title>
            </Modal.Header> */}
            <Modal.Body 
                style={{ display: "flex", justifyContent: "center", width: width * 0.6, height: height *0.58, maxWidth: width, padding: "unset" }}>
                <div style={{display: "flex", justifyContent:"center", alignItems: "center", width: "100%", height: "100%"}}>
                    <div 
                        style={{
                            height: "100%", 
                            width: "50%", 
                            backgroundColor: "#d9d9d9",
                            display: "flex",
                            justifyContent:"center",
                            alignItems:"center"
                        }}
                    >
                        <div 
                        style={{display: "flex", alignItems: "center", justifyContent:"center", flexDirection: "column"}}>
                            <Image src={logo} style={{width: "210.4px", height: "91.2px"}}/>
                            <p style={{fontFamily: "'Lato'", fontSize:"2.5vw", fontWeight: "600", color: "black"}}>Snoopods</p>
                        </div>
                    </div>

                    <div style={{height: "100%", width: "50%", backgroundColor: "#162048", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                        <p style={{color: "white", paddingBottom: "4.8%", fontFamily:"'Lato'", fontWeight: "bold", letterSpacing: "1px", fontSize: "1.875vw"}}>Welcome</p>
                        <GoogleLogin
                            clientId={CLIENT_ID}
                            buttonText="Continue with Google"
                            onSuccess={onGoogleLoginSuccess}
                            onFailure={onGoogleLoginFailed}
                            cookiePolicy={'single_host_origin'} 
                            />
                    </div>
                        
                </div>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer> */}
            <style>
                {`  .modal-content{
                        border: unset;
                    }
                    .my-modal{
                        max-width: ${width}px;
                        width: 60%;
                        height: 58%;

                    }
                `}
            </style>
        </Modal>
    );
}

export default LoginPopup;