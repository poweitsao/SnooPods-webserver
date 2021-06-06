import {getUserVolume} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Collection, Track} from "../../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        if (req.query["email"]) {
            let email: string = req.query["email"].toString()
            let getUserVolumeRes = await getUserVolume(email)
            
            res.status(getUserVolumeRes.status).json(getUserVolumeRes.volume)
        } else{
            res.status(404).end()
        }

        // console.log("req.query:" + req.query["subID"])


    }
    
}