import verify from "../../../database/verifyGoogleID"

export default async function handler(req, res) {

    console.log("Google User Verifier")
    if (req.method === "GET") {
        // console.log(req.query)
        if (req.query) {
            // let podcast = await firestore.getPodcast(req.query["podcastInfo"][0], req.query["podcastInfo"][1])
            let userID = req.query["googleIDToken"][0]
            console.log("verifying token...")
            try {
                let verification = await verify(userID)
                res.status(200).json({ "userIDToken": userID, "verification": verification })

            }
            catch (e) {
                res.status(500)
            }
        }

    }


}