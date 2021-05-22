// const Firestore = require('@google-cloud/firestore');
// import {Firestore} from "@google-cloud/firestore";
import {Timestamp, Track, Collection} from "../ts/interfaces"

var file = require("../credentials/read-write-credentials/snoopods-us-bd34eda00ba3.json")


// const db = new Firestore({
//     projectId: 'snoopods-us',
//     credentials: { client_email: file.client_email, private_key: file.private_key }
// });
const admin = require('firebase-admin');

const serviceAccount = require('../credentials/read-write-credentials/snoopods-us-bd34eda00ba3.json');

// admin.app().delete()
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}


const db = admin.firestore();

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

export async function getTrack(trackID: string){
    let trackRef = db.collection("tracks").doc(trackID)
    let trackDoc = await trackRef.get()
    let trackData = trackDoc.data()
    let track:Track = {
        filename: trackData["filename"],
        cloud_storage_url: trackData["cloudStorageURL"],
        date_posted: trackData["datePosted"],
        audio_length: trackData["audioLength"],
        track_name: trackData["trackName"],
        track_id: trackData["trackID"]
    }
    return track
}

export async function createUser(user) {
    let userRef = db.collection("users").doc(user.email)
    console.log("creating user!")
    try {

        var likedTracksCollectionID = await createCollection("My Liked Tracks", user.email, [])

        await userRef.set({
            collections: [],
            currentPlaylist: {"playlistID": "", "playlistName": "", "tracks": []},
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

export async function getUserCollections(email) {
    let userRef = db.collection("users").doc(email)
    console.log("getting user collections of", email)
    try {
        let userData = await userRef.get()
        userData = userData.data()
        let userCollections = userData.collections
        return userCollections
    } catch (e) {
        console.log(e)
        return null
    }
}

export const addNewCollection = async(collectionName: string, email: string) => {
    let newCollectionID = await createCollection(collectionName, email, [])
    let userRef = db.collection("users").doc(email)
    try{
        // let userData = await userRef.get()
        // var newEntry = {"collectionID": newCollectionID, "collectionName": collectionName };
        // var newEntryString = JSON.stringify(newEntry)
        await userRef.update({
            collections: admin.firestore.FieldValue.arrayUnion({"collectionID": newCollectionID, "collectionName": collectionName})
        })
        return 200
    }catch(e){
        console.error("error in addNewCollection", e)
        return 500
    }

}

export const deleteCollection = async(collectionID: string, collectionName: string, email: string) => {
    console.log("deleteCollection for firestore got", email, collectionID)
    let userRef = db.collection("users").doc(email)
    

    try{
        userRef.update({collections:admin.firestore.FieldValue.arrayRemove({"collectionID": collectionID, "collectionName": collectionName}) })
    } catch(e){
        console.log("error in deleteCollection, deleting collection from user", e)
        return 500
    }
    try{
        let collectionRef = db.collection("collections").doc(collectionID)
        await collectionRef.delete()
    } catch(e){
        console.log("error in deleteCollection, deleting collection from collections", e)
        return 500
    }

    return 200


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
    let docRef = db.collection("subreddits").doc(subID)
    let doc = await docRef.get()

    let mainCollectionID: string = doc.data().mainCollectionID
    
    let collectionRef = db.collection("collections").doc(mainCollectionID)
    let collectionDoc = await collectionRef.get()
    let tracks : Array<string> = collectionDoc.data().tracks


    let collection = <Collection>{keys:[], tracks:{}};
    // console.log(doc)
    for (const [index, track_id] of tracks.entries()) {
        let trackRef = db.collection("tracks").doc(track_id)
        let trackDoc = await trackRef.get()

        
        // console.log(doc.id, '=>', doc.data());
        let trackData = trackDoc.data()
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
        collection["cover_url"] = subredditsDoc.data()["pictureURL"]
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

export async function getQueue(email: string){
    console.log("email in getQueue", email)
    let userRef = db.collection("users").doc(email)
    try {
        
        let userData = await userRef.get()
        userData = userData.data()
        return {currentTrack: userData.currentTrack, currentPlaylist: userData.currentPlaylist, queue: userData.queue}
        
    } catch (error) {
        console.error("error in getQueue", error)
        
    }

}


module.exports = {
    getPodcast,
    getUser,
    createUser,
    createSession,
    checkValidSession,
    getFeaturedSubreddits,
    getSubredditPlaylist,
    getUserCollections,
    addNewCollection, 
    deleteCollection,
    getQueue,
    getTrack
}