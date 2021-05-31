import {getUserSubLists} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Collection} from "../../../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["email"]) {
            console.log("req.query:" + req.query["email"])
            let email = req.query["email"].toString()
            let subLists = await getUserSubLists(email)
            // console.log("collection", collection["tracks"][collection["keys"][0]].date_posted._seconds)
            res.status(200).json(subLists)

        }
    }
}