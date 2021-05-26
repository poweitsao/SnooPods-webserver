import { connect } from "react-redux"
import TrackOptionsButton from "../buttons/TrackOptionsButton"

function mapStateToProps(state, ownProps) {
    // console.log("ownProps", ownProps)
    return state
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(TrackOptionsButton)