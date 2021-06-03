import {getHistoryTracks} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["email"]) {
            let email: string = req.query["email"].toString()
            let getHistoryTracksRes = await getHistoryTracks(email)
            res.status(getHistoryTracksRes.status).json(getHistoryTracksRes.tracks)
        }
    }
    
}