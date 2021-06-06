import {renameSubList, addSubToSubList, removeSubFromSubList} from "../../../../database/firestore"
import type { NextApiRequest, NextApiResponse } from 'next'
import {Timestamp, Collection, Track} from "../../../../ts/interfaces"

interface Fields {
    subListID: string,
    email: string, 
    newSubListName?: string,
    newSubID?: string, 
    subCollectionIDToRemove?: string,
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        let {action, fields} :{action: string, fields: Fields} = JSON.parse(req.body)
        console.log("request sent to sublists/edit, action:", action)

        // console.log("req.query:" + req.query["subID"])
        // let serverRes = await pushQueueToDB(email, queueInfo)
        let serverRes: number;
        if (action == "renameSubList"){
            serverRes = await renameSubList(fields.newSubListName, fields.subListID, fields.email)
        } else if (action == "addSubreddit"){
            serverRes = await addSubToSubList(fields.subListID, fields.newSubID, fields.email)
        } else if (action == "removeSubreddit"){
            serverRes = await removeSubFromSubList(fields.subListID, fields.subCollectionIDToRemove, fields.email)
        }

        res.status(serverRes).end()

    }
    
}