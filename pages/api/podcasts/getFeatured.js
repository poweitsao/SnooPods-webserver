import firestore from "../../../database/firestore"

export default async function handler(req, res) {
    // console.log("getting featured podcasts")

    if (req.method === "GET") {
        // console.log(req.query)
        if (req.query) {

            let featured = await firestore.getFeaturedSubreddits()
            let featuredSubreddits = {}
            featuredSubreddits["_keys"] = []
            featured.forEach(subreddit => {
                // console.log(subreddit.id, '=>', subreddit.data());
                featuredSubreddits[subreddit.id] = subreddit.data()
                featuredSubreddits["_keys"].push(subreddit.id)
            });

            // console.log("featured subreddits: ", featuredSubreddits)
            res.status(200).json(featuredSubreddits)

        }

    }


}