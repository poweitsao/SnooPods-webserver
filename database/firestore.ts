// const Firestore = require('@google-cloud/firestore');
import {Firestore} from "@google-cloud/firestore";
import {Timestamp, Track, Collection} from "../ts/interfaces"

var file = require("../credentials/read-write-credentials/snoopods-us-bd34eda00ba3.json")


const db = new Firestore({
    projectId: 'snoopods-us',
    credentials: { client_email: file.client_email, private_key: file.private_key }
});

export async function getPodcast(subreddit, podcast) {
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
    return
}

export async function getUser(email) {
    console.log("getting user by email...")
    // console.log(email)
    let userRef = db.collection("users")
    let snapshot = await userRef.doc(email).get()
    // console.log("snapshot", snapshot)
    try {
        if (!snapshot.exists) {
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

// export async function createUser(user) {
//     let userRef = db.collection("users").doc(user.email)
//     console.log("creating user!")
//     try {
//         await userRef.set({
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             picture_url: user.picture_url
//         })
//         let sessionID = await createSession(user.email)
//         return {
//             sessionID: sessionID,
//             email: user.email
//         }
//     } catch (e) {
//         console.log(e)
//         return null
//     }
// }

export async function createUser(user) {
    let userRef = db.collection("users").doc(user.email)
    console.log("creating user!")
    try {

        var likedTracksCollectionID = await createCollection("My Liked Tracks", user.email, [])

        await userRef.set({
            collections: [],
            currentPlaylist: {},
            currentTrack: "",
            email: user.email,
            firstName: user.firstName,
            history: [],
            lastName: user.lastName,
            likedTracksCollectionID: likedTracksCollectionID,
            pictureURL: user.picture_url,
            queue: [],
            subscriptionLists: []
        })
        let sessionID = await createSession(user.email)

        
        return {
            sessionID: sessionID,
            email: user.email
        }
    } catch (e) {
        console.log(e)
        return null
    }
}

export const createCollection = async (collectionName: string, ownerID: string, tracks: Array<string>) => {
    // console.log("creating collection", collectionName)
    try{
        const res = await db.collection("collections").add({
            collectionID: "",
            collectionName: collectionName,
            ownerID: ownerID, 
            tracks: tracks
        })
        var key = res.id 
        await db.collection("collections").doc(res.id).update({collectionID: key})
        return key
    } catch(e){
        console.error("error in createCollection", e)
    }
}

const generateID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

export async function createSession(email) {
    const sessionID = generateID()
    let userRef = db.collection("users").doc(email)
    console.log("creating session")
    try {
        await userRef.set({
            sessionID: sessionID
        }, { merge: true })
        return sessionID
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function checkValidSession(sessionID: string, email: string) {
    let userRef = db.collection("users").doc(email)
    let user = await userRef.get()
    let data = user.data()
    if (sessionID === data.sessionID) {
        data.validSession = true;
        return data
    }
    else {
        return { validSession: false }
    }
}

export async function getFeaturedSubreddits() {
    let docRef = db.collection("subreddits")
    let featured = await docRef.get()
    return featured;
}

export async function getSubredditPlaylist(subID) {
    // console.log("subID in firestore:" + subID)
    let docRef : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = db.collection("subreddits").doc(subID)
    let doc = await docRef.get()

    let mainCollectionID: string = doc.data().mainCollectionID
    
    let collectionRef : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = db.collection("collections").doc(mainCollectionID)
    let collectionDoc = await collectionRef.get()
    let tracks : Array<string> = collectionDoc.data().tracks


    let collection = <Collection>{keys:[], tracks:{}};
    // console.log(doc)
    for (const [index, track_id] of tracks.entries()) {
        let trackRef : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = db.collection("tracks").doc(track_id)
        let trackDoc = await trackRef.get()

        
        // console.log(doc.id, '=>', doc.data());
        let trackData:FirebaseFirestore.DocumentData = trackDoc.data()
        let track:Track = {
            filename: trackData["filename"],
            cloud_storage_url: trackData["cloudStorageURL"],
            date_posted: trackData["datePosted"],
            audio_length: trackData["audioLength"],
            track_name: trackData["trackName"],
            track_id: trackData["trackID"]
        }

        // console.log(track)
        // console.log(collection)
        collection["keys"].push(track_id)
        collection["tracks"][track_id] = track

    }
    // collection
    // console.log("doc", doc)

    let subredditsDocRef = db.collection("subreddits").doc(subID)
    let subredditsDoc = await subredditsDocRef.get()
    if (!subredditsDoc.exists) {
        console.log("No album picture found")
    } else {
        collection["album_cover_url"] = subredditsDoc.data()["pictureURL"]
    }
    // console.log("collection info:", collection)
    return collection

    // if (!doc.exists) {
    //     console.log('No such document!');
    //     return null
    // } else {
    //     console.log('Document data:', doc.data());
    //     return doc.data()
    // }

}



module.exports = {
    getPodcast,
    getUser,
    createUser,
    createSession,
    checkValidSession,
    getFeaturedSubreddits,
    getSubredditPlaylist
}