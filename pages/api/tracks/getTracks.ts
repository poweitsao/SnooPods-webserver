import {getTracks} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Track} from "../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "POST") {
        let {trackIDs}:{trackIDs: Array<string>} = JSON.parse(req.body)
        if(trackIDs.length > 0){
            let getTracksRes = await getTracks(trackIDs)
            res.status(getTracksRes.status).json(getTracksRes.tracks)
        }

        // let trackID = req.query["trackID"].toString()
        // console.log("req.query:" + trackID)
        // let track:Track = await getTrack(trackID)
        // res.status(200).json(track)

        
    }
}