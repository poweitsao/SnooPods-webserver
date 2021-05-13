import {getSubredditPlaylist} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Playlist, Track} from "../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["subID"]) {
            console.log("req.query:" + req.query["subID"])
            let playlist:Playlist = await getSubredditPlaylist(req.query["subID"])
            // console.log("playlist", playlist["tracks"][playlist["keys"][0]].date_posted._seconds)
            res.status(200).json(playlist)

        }
    }
}