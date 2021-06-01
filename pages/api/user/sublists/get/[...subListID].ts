import {getUserCollections, getSubListCollections, getSingleUserSubList} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["subListID"]) {
            
            let email = req.query["subListID"][0].toString()
            let subListID = req.query["subListID"][1].toString()
            // console.log("get single collection called")
            console.log("req.query:", subListID, email)
            let getUserSubListRes = await getSingleUserSubList( email, subListID)
            console.log("getUserSubListRes", getUserSubListRes)
            if (getUserSubListRes.status == 200){
                let getSubListCollectionsRes = await getSubListCollections(getUserSubListRes.subListData.latestCollectionsFromSubreddits)
                if (getSubListCollectionsRes.status == 200){
                    let subList = getUserSubListRes.subListData
                    subList.collections = getSubListCollectionsRes.subListCollections
                    res.status(200).json(subList)
                } else{
                    res.status(500).end()
                }
            
            } else{
                res.status(getUserSubListRes.status).end()
            }            

        }
    }
    res.status(500).end()
}