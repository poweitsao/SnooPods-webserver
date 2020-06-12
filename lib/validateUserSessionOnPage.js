import Router from 'next/router';

const validateSession = async (session_id, email) => {
    const res = await fetch("/api/user/validateSession/" + session_id + "/" + email, { method: "GET" })
    if (res.status === 200) {
        const object = await res.json()
        // console.log(object)
        if (object.validSession) {
            Router.push("/home")
            return object
        }
    }
}


export default validateSession;