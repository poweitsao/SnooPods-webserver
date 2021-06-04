import {getSubredditPlaylist} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Collection, Track} from "../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("request sent to subID")
    if (req.method === "GET") {
        if (req.query["subID"]) {
            console.log("req.query:" + req.query["subID"])
            let playlist = await getSubredditPlaylist(req.query["subID"])
            // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
            
            console.log("playlist in api", playlist)
            res.status(200).json(playlist)

        }
    }
}