import {addNewCollection} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Collection} from "../../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        let {email, collectionName} = JSON.parse(req.body)
        console.log("req.query: creating " + collectionName + " for " + email)
        const serverRes = await addNewCollection(collectionName, email)
        // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
        res.status(serverRes).end()

        
    }
}