const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'eternal-arcana-275612',
    keyFilename: '/Users/poweitsao/Desktop/web-server/credentials/eternal-arcana-275612-60a441babd37.json',
});

async function getPodcast(subreddit, podcast) {
    console.log("getPodcast executed")
    if (subreddit && podcast) {
        let podcastRef = db.collection("subreddits").doc(subreddit).collection('podcasts').doc(podcast + ".mp3");
        console.log("getting podcast")
        let doc = await podcastRef.get()
        console.log("podcastRef.get() executed")
        if (!doc.exists) {
            console.log('No such document!');
            return null
        } else {
            console.log('Document data:', doc.data());
            return doc.data()
        }


    }


}

module.exports = {
    getPodcast
}

// getPodcast("Julie", "hiJuJu")