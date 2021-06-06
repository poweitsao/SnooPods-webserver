import {toggleUserLikedTracks} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "POST") {
        let {email, trackID} = JSON.parse(req.body)
        
        console.log("req set to toggleLike:", email, trackID)
        const serverRes = await toggleUserLikedTracks(trackID, email)
        res.status(serverRes).end()

        
    }
}