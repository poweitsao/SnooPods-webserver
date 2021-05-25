import Modal from 'react-bootstrap/Modal'
import { GoogleLogin } from 'react-google-login';
import { CLIENT_ID } from "../lib/constants"
import Button from "react-bootstrap/Button"
import parseCookies from "../lib/parseCookies"
import Router from "next/router"
import Cookie from "js-cookie"
async function onGoogleLoginSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    let response = await fetch("/api/user/" + id_token, { method: "GET" }, { revalidateOnMount: false })
    if (response.status == 200) {
        let res = await response.json()
        if (res.registered) {
            //store session_id
            Cookie.set("session_id", res.session_id)
            Cookie.set("email", res.verification.payload.email)

            Router.reload()
        }
        else if (!res.registered) {
            RegisterStore.dispatch(storeRegisterationInfo(res))
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
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Please sign in to continue.
          </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                    clientId={CLIENT_ID}
                    buttonText="Sign In with Google"
                    onSuccess={onGoogleLoginSuccess}
                    onFailure={onGoogleLoginFailed}
                    cookiePolicy={'single_host_origin'} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginPopup;