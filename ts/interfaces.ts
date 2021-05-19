export interface Timestamp{
    _seconds: number,
    _nanoseconds: number
}

export interface Track{
    filename: string,
    cloud_storage_url: string,
    date_posted: Timestamp,
    audio_length: number,
    track_name: string,
    track_id: string
}

export interface Collection {
    keys: Array<string>,
    tracks: {[x: string]: Track},
    collectionName: string
  }

export interface UserSession {
    sessionID: string, 
    email: string,
    firstName: string,
    lastName: string,
    pictureURL: string,
    validSession?: boolean, 
}