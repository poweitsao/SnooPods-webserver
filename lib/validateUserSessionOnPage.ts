import {UserSession} from "../ts/interfaces";

const validateSession = async (session_id : string, email : string) => {
    const res = await fetch("/api/user/validateSession/" + session_id + "/" + email, { method: "GET" })
    if (res.status === 200) {
        const response : JSON = await res.json()
        // console.log(object)
        var userSession : UserSession = {
            sessionID: response["sessionID"],
            email: response["email"],
            firstName: response["firstName"],
            lastName: response["lastName"],
            pictureURL: response["pictureURL"],
            validSession: response["validSession"]
        }
        return userSession
    }
}


export default validateSession;