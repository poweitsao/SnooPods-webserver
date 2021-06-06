import {addToQueue} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        let {email, trackIDs, playlistName} = JSON.parse(req.body)
        // console.log("request sent to pushQueueToDB", email, queueInfo)

        // console.log("req.query:" + req.query["subID"])
        let serverRes = await addToQueue(email, trackIDs, playlistName)
        res.status(serverRes.status).json(serverRes.tracks)

    }
    
}