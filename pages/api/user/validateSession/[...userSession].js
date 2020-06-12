import { checkValidSession } from "../../../../database/firestore"

export default async function handler(req, res) {

    if (req.method === "GET") {
        // console.log(req.query)
        if (req.query["userSession"][0] && req.query["userSession"][1]) {
            var session_id = req.query["userSession"][0]
            var email = req.query["userSession"][1]
            let user = await checkValidSession(session_id, email)
            // console.log("valid Session: ", user.validSession)
            res.status(200).json(user)
        } else {
            res.status(200).json({ validSession: false })

        }

    }
}