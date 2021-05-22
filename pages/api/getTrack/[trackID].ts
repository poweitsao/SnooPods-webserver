import {getTrack} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Track} from "../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["trackID"]) {
            let trackID = req.query["trackID"].toString()
            console.log("req.query:" + trackID)
            let track:Track = await getTrack(trackID)
            // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
            res.status(200).json(track)

        }
    }
}