import {getCategorySubreddits} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import { Track } from "../../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("getCategoryData api pinged")

    if (req.method === "GET") {
        if (req.query["categoryID"]) {
            let categoryID = req.query["categoryID"].toString()
            console.log("getting categoryData", categoryID)

            let getCategorySubredditsRes = await getCategorySubreddits(categoryID)
            res.status(getCategorySubredditsRes.status).json(getCategorySubredditsRes.categoryData)
        }
    }
    
}