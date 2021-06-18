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
            
        >
             
            {/* <Modal.Header closeButton style={{width: width, height: height}}style={{width: width, height: height}}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Please sign in to continue.
                </Modal.Title>
            </Modal.Header> */}
            <Modal.Body 
                style={{ display: "flex", justifyContent: "center", width: width * 0.6, height: height *0.58, maxWidth: width, padding: "unset" }}>
                <div style={{display: "flex", justifyContent:"center", alignItems: "center", width: "100%", height: "100%"}}>
                    <div style={{height: "100%", width: "50%", backgroundColor: "#d9d9d9"}}>
                        <Image src={logo}/>
                    </div>

                    <div style={{height: "100%", width: "50%", backgroundColor: "#162048"}}>

                    </div>
                        {/* <GoogleLogin
                            clientId={CLIENT_ID}
                            buttonText="Sign In with Google"
                            onSuccess={onGoogleLoginSuccess}
                            onFailure={onGoogleLoginFailed}
                            cookiePolicy={'single_host_origin'} /> */}
                </div>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer> */}
            <style>
                {`
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