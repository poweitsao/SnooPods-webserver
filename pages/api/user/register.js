import { createUser, getUser } from "../../../database/firestore"


export default async function handler(req, res) {
    console.log("post request")
    if (req.method === "POST") {
        let user = JSON.parse(req.body)
        console.log("request", user)
        let session = await createUser(user)
        if (session) {
            console.log("user created")
            console.log("session", session)
            res.status(201).send({ registeration_complete: true, session_id: session.sessionID, email: session.email })
            // res.registeration_complete = true
            // console.log("response:", res.registeration_complete)
            // res.body = { registeration_complete: true }
            // res.status(201).end()
            // console.log(res.registeration_complete)
            // res.send()
        }
        else {
            res.status(500).json({ registeration_complete: false, session_id: null })
        }
    }
}