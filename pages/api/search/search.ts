import {searchCategoriesAndSubreddits} from "../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Collection, Track} from "../../../ts/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        let {query} = JSON.parse(req.body)
        console.log("request sent to search", query)

        // console.log("req.query:" + req.query["subID"])
        let querySearchResponse = await searchCategoriesAndSubreddits(query)
        let {categories, subreddits, status}:
        {categories: Array<string>, subreddits: Array<string>, status: number} = querySearchResponse

        res.status(status).json({categories: categories, subreddits: subreddits})

    }
    
}