import {getCollection} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["collectionID"]) {
            
            let email = req.query["collectionID"][0].toString()
            let collectionID = req.query["collectionID"][1].toString()
            // console.log("get single collection called")
            console.log("req.query:", collectionID, email)
            let collection = await getCollection( collectionID)
            res.status(200).json(collection)

        }
    }
    res.status(500).end()
}