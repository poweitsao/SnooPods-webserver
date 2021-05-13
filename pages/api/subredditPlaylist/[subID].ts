import {getSubredditPlaylist} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    interface timestamp{
        _seconds: number,
        _nanoseconds: number
    }

    interface Track{
        filename: string,
        cloud_storage_url: string,
        date_posted: timestamp,
        audio_length: number,
        post_title: string
    }

    interface PlaylistInterface {
        keys: Array<string>;
        tracks: {[x: string]: Track}
      }

    if (req.method === "GET") {
        if (req.query["subID"]) {
            console.log("typescript:", req.query)
            console.log("req.query:" + req.query["subID"])
            let playlist:PlaylistInterface = await getSubredditPlaylist(req.query["subID"])
            // console.log("playlist", playlist["tracks"][playlist["keys"][0]].date_posted._seconds)
            res.status(200).json(playlist)

        }
    }
}