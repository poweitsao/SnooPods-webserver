import {renameCollection, addTrackToCollection, removeTrackFromCollection} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Collection, Track} from "../../../../ts/interfaces"

interface Fields {
    collectionID: string,
    email: string, 
    newCollectionName?: string,
    newTrackID?: string, 
    trackIDToRemove?: string,
    trackIndex?: string
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        let {action, fields} :{action: string, fields: Fields} = JSON.parse(req.body)
        console.log("request sent to collections/edit, action:", action)

        // console.log("req.query:" + req.query["subID"])
        // let serverRes = await pushQueueToDB(email, queueInfo)
        let serverRes: number;
        if (action == "renameCollection"){
            serverRes = await renameCollection(fields.collectionID, fields.newCollectionName, fields.email)
        } else if (action == "addTrack"){
            serverRes = await addTrackToCollection(fields.collectionID, fields.newTrackID, fields.email)
        } else if (action == "removeTrack"){
            serverRes = await removeTrackFromCollection(fields.collectionID, fields.trackIDToRemove, fields.trackIndex, fields.email)
        }

        res.status(serverRes).end()

    }
    
}