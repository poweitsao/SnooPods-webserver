export interface Timestamp{
    _seconds: number,
    _nanoseconds: number
}

export interface Track{
    filename: string,
    cloud_storage_url: string,
    date_posted: Timestamp,
    audio_length: number,
    post_title: string
}

export interface Playlist {
    keys: Array<string>;
    tracks: {[x: string]: Track}
  }