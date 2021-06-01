import { connect } from "react-redux"
import store from "../../redux/store"
import { storeAudioPlayerInfo, togglePlaying } from "../../redux/actions/index"
import AudioPlayerBar from "../AudioPlayerBar"


const getAudioPlayerStatus = () => {
    return store.getState().audioPlayerInfo.AudioPlayerInfo;
}

// const mapStateToProps = (state) => ({
//     AudioPlayerInfo: getAudioPlayerStatus()
// })

function mapStateToProps(state) {
    // console.log("mapStateToProps", state)
    return state
}

const mapDispatchToProps = (dispatch) => ({
    changeAudioPlayerInfo: AudioPlayerInfo => dispatch(storeAudioPlayerInfo(AudioPlayerInfo)),
    togglePlaying: playing => dispatch(togglePlaying(playing))

})

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerBar)