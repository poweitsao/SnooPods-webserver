import {addNewSubList} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        let {email, subListName} = JSON.parse(req.body)
        console.log("req.query: creating " + subListName + " for " + email)
        const serverRes = await addNewSubList(subListName, email)
        // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
        res.status(serverRes).end()

        
    }
}