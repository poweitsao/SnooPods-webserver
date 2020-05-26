import firestore from "../../../database/firestore"

export default async function handler(req, res) {
    // Get data from your database
    // console.log("click")

    // firestore.getPodcast();
    console.log("podcast Handler")
    if (req.method === "GET") {
        console.log(req.query)
        if (req.query) {
            let podcast = await firestore.getPodcast(req.query["podcastInfo"][0], req.query["podcastInfo"][1])
            console.log("podcast: ", podcast)
            res.status(200).json(podcast)

        }

    }


}