import { connect } from "react-redux"
import PanelTrackOptionsButton from "../buttons/PanelTrackOptionsButton"

function mapStateToProps(state, ownProps) {
    // console.log("ownProps", ownProps)
    return state
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(PanelTrackOptionsButton)