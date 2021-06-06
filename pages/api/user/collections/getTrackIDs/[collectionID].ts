import {getCollectionTrackIDs} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Collection} from "../../../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["collectionID"]) {
            console.log("req.query:" + req.query["collectionID"])
            let collectionID = req.query["collectionID"].toString()
            let trackIDs: Array<string> = await getCollectionTrackIDs(collectionID)
            // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
            res.status(200).json(trackIDs)

        }
    }
}