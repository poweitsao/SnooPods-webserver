import { connect } from "react-redux"
import { QueueStore } from "../../redux/store"
import { storeQueueInfo, getQueueInfo, pushNextTrack, replaceCurrentTrack, addPlaylistToQueue, clearCurrentPlaylist, removeTrackFromCurrentPlaylist, removePlaylistFromQueue, removeTrackFromQueue } from "../../redux/actions/queueActions";
import AudioPlayerBar from "../AudioPlayerBar"


// const getAudioPlayerStatus = () => {
//     return AudioPlayerStore.getState().AudioPlayerInfo;
// }

// const mapStateToProps = (state) => ({
//     AudioPlayerInfo: getAudioPlayerStatus()
// })

function mapStateToProps(state) {
    // console.log("mapStateToProps", state)
    return state
}

const mapDispatchToProps = (dispatch) => ({
    // changeAudioPlayerInfo: AudioPlayerInfo => dispatch(storeAudioPlayerInfo(AudioPlayerInfo)),
    // togglePlaying: playing => dispatch(togglePlaying(playing))
    changeQueueInfo: QueueInfo => dispatch(storeQueueInfo(QueueInfo)), 
    // getQueueInfo, 
    nextTrack: () => dispatch(replaceCurrentTrack()), 
    playNewTrack: (track) => dispatch(replaceCurrentTrack(track)), 
    addPlaylistToQueue: (newPlaylist) => dispatch(addPlaylistToQueue(newPlaylist)), 
    clearCurrentPlaylist: () => dispatch(clearCurrentPlaylist()), 
    removeTrackFromCurrentPlaylist: (trackID, index) => dispatch(removeTrackFromCurrentPlaylist(trackID, index)), 
    removePlaylistFromQueue: (playlistID) => dispatch(removePlaylistFromQueue(playlistID)), 
    removeTrackFromQueue: (playlistID, trackID, index) => dispatch(removeTrackFromQueue(playlistID, trackID, index))

})

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerBar)