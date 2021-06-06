import {deleteCollection} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Collection} from "../../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        let {email, collectionID, collectionName} = JSON.parse(req.body)
        console.log("req.query: deleting " + collectionID + " for " + email)
        const serverRes = await deleteCollection(collectionID, collectionName, email)
        // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
        res.status(serverRes).end()

        
    }
}