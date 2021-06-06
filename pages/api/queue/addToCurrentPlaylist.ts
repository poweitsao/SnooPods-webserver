import {addToCurrentPlaylist} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        let {email, trackIDs, playlistName} = JSON.parse(req.body)
        console.log("request sent to addToCurrentPlaylist", email, trackIDs, playlistName)

        // console.log("req.query:" + req.query["subID"])
        let serverRes = await addToCurrentPlaylist(email, trackIDs, playlistName)
        res.status(serverRes.status).json(serverRes.tracks)

    }
    
}