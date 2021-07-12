import { connect } from "react-redux"
import HomePanel from "../HomePanel"

function mapStateToProps(state, ownProps) {
    return state
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(HomePanel)