import {getQueue} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Collection, Track} from "../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        let {email} = JSON.parse(req.body)
        console.log("request sent to getQueue", email)

        // console.log("req.query:" + req.query["subID"])
        let queue = await getQueue(email)
        // console.log(queue)
        // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
        res.status(200).json(queue)

    }
    
}