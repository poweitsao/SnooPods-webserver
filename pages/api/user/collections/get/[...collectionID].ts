import {getUserCollections, getTracks, getSingleUserCollection} from "../../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        if (req.query["collectionID"]) {
            
            let email = req.query["collectionID"][0].toString()
            let collectionID = req.query["collectionID"][1].toString()
            console.log("get single collection called")
            console.log("req.query:", collectionID, email)
            let getUserCollectionsRes = await getSingleUserCollection( email, collectionID)
            
            if (getUserCollectionsRes.status == 200){
                let getTracksRes = await getTracks(getUserCollectionsRes.collectionData.tracks)
                if (getTracksRes.status == 200){
                    let collection = getUserCollectionsRes.collectionData
                    collection.tracks = getTracksRes.tracks
                    // console.log("collection.tracks", collection.tracks)
                    res.status(200).json(collection)
                }else{
                    res.status(500).end()
                }
            
            } else{
                res.status(getUserCollectionsRes.status).end()
            }            

        }
    }
    res.status(500).end()
}