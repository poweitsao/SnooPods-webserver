import { connect } from "react-redux"
import { QueueStore } from "../../redux/store"
import { storeAudioPlayerInfo, togglePlaying } from "../../redux/actions/index"
import QueuePageBody from "../QueuePageBody.tsx"

// const mapStateToProps = (state) => ({
//     AudioPlayerInfo: getAudioPlayerStatus()
// })

function mapStateToProps(state) {
    // console.log("mapStateToProps", state)
    return state
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(QueuePageBody)