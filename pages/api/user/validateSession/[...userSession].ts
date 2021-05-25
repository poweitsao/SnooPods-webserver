import { checkValidSession } from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {UserSession} from "../../../../ts/interfaces"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        // console.log(req.query)
        if (req.query["userSession"][0] && req.query["userSession"][1]) {
            var session_id = req.query["userSession"][0]
            var email = req.query["userSession"][1]
            let userInfo = await checkValidSession(session_id, email)
            let user: UserSession = {
                sessionID: userInfo.sessionID,
                pictureURL: userInfo.pictureURL,
                email: userInfo.email,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                validSession: userInfo.validSession
            }
            console.log("user from api endpoint ", user)
            res.status(200).json(user)
        } else {
            res.status(200).json({ validSession: false })

        }

    }
}