import {updateUserVolume} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        let {email, newVolume}: {email:string, newVolume: number} = JSON.parse(req.body)

        // console.log("req.query:" + req.query["subID"])
        let updateUserVolumeRes = await updateUserVolume(email, newVolume)

        res.status(updateUserVolumeRes.status).end()

    }
    
}