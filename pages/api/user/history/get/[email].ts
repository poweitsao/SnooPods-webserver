import {getUserHistory} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["email"]) {
            
            let email = req.query["email"].toString()
            console.log("email in get history", email)
            let getUserHistoryRes = await getUserHistory(email)
            res.status(getUserHistoryRes.status).json(getUserHistoryRes.history)
        }
 
    }
    
}