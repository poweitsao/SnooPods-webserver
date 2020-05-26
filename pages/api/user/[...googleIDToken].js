import verify from "../../../database/verifyGoogleID"
import { getUser } from "../../../database/firestore"

export default async function handler(req, res) {
    // return new Promise(resolve => {
    console.log("Google User Verifier")
    if (req.method === "GET") {
        // console.log(req.query)
        if (req.query) {
            // let podcast = await firestore.getPodcast(req.query["podcastInfo"][0], req.query["podcastInfo"][1])
            let userID = req.query["googleIDToken"][0]
            console.log("verifying token...")
            try {
                let verification = await verify(userID)
                console.log(verification)
                if (verification) {
                    console.log("checking if user is registered")
                    if (await getUser(userID)) {
                        res.status(200).json({ registered: true, "verification": verification })
                    }
                    else {
                        res.status(200).json({ registered: false, "verification": verification })
                    }

                }
                else {
                    res.status(500).end()
                }

                //post to the database
                //store 'paybload' to database
                // in index.js, use cookies to store loggedIn = true
                // when loggedIn == true: go to database and verify if userID is still valid
                // 
            }
            catch (e) {
                res.status(500).end()
                throw new Error(e);

            }
        }

    }

    // })



}