import {updateUserHistory} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import { Track } from "../../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "POST") {
        let {email, newHistory}:{email: string, newHistory: Array<Track>} = JSON.parse(req.body)
        let updateUserHistoryRes = await updateUserHistory(email, newHistory)
        res.status(updateUserHistoryRes.status).end()
    }
    
}