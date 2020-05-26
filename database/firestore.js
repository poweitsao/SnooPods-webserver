const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'eternal-arcana-275612',
    keyFilename: '../web-server/credentials/read-write credentials/eternal-arcana-275612-2a726e49cb23.json',
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

async function getUser(id_token) {
    console.log("gettind user by token_id...")
    console.log(id_token)
    let userRef = db.collection("users")
    let snapshot = await userRef.where('token_id', '==', id_token).get()

    try {
        if (snapshot.empty) {
            console.log('User not found');
            return false;
        }
        else {
            console.log('User found')
            return true;
        }
    }

    catch (err) {
        console.log('Error getting user', err);
        return false
    }


}

module.exports = {
    getPodcast,
    getUser
}

// getPodcast("Julie", "hiJuJu")