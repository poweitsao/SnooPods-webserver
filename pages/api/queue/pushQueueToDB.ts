import {pushQueueToDB} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Collection, Track} from "../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        let {email, queueInfo} = JSON.parse(req.body)
        console.log("request sent to pushQueueToDB", email, queueInfo)

        // console.log("req.query:" + req.query["subID"])
        let serverRes = await pushQueueToDB(email, queueInfo)
        res.status(serverRes).end()

    }
    
}