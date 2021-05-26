import { connect } from "react-redux"
import QueuePlaylistOptionsButton from "../buttons/QueuePlaylistOptionsButton"

function mapStateToProps(state, ownProps) {
    // console.log("ownProps", ownProps)
    return state
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(QueuePlaylistOptionsButton)