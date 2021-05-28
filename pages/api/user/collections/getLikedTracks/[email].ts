import {getUserLikedTracks} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["email"]) {
            console.log("req.query:" + req.query["email"])
            console.log("GETTING LIKED TRACKS")
            const {status: serverRes, likedTracks} = await getUserLikedTracks(req.query["email"].toString())
            // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
            res.status(serverRes).json(likedTracks)

        }
    }
}