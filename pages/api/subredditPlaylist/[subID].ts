import {getSubredditPlaylist} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Collection, Track} from "../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["subID"]) {
            console.log("req.query:" + req.query["subID"])
            let collection:Collection = await getSubredditPlaylist(req.query["subID"])
            // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
            res.status(200).json(collection)

        }
    }
}