import {deleteSubList} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Collection} from "../../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        let {email, subListID, subListName} = JSON.parse(req.body)
        console.log("req.query: deleting " + subListID + " for " + email)
        const serverRes = await deleteSubList(subListID, subListName, email)
        // console.log("subList", subList["tracks"][subList["keys"][0]].date_posted._seconds)
        res.status(serverRes).end()

        
    }
}