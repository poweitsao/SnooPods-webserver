function ShowMusicPlayer(props) {
    // console.log("props: ", props.audioSource)
    if (!props.audioSource) {
        return null;
    }

    return (
        <audio controls={true} autoPlay={false} name="media" src={props.audioSource} type="audio/mpeg"></audio>
    );
}

class MusicPlayer extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { audioSource: props }
    }
    render() {
        // console.log("hi")
        return (
            <div>
                {/* <audio controls="true" autoplay="false" name="media" src={this.state.audioSource} type="audio/mpeg"></audio> */}
                <ShowMusicPlayer audioSource={this.props.audioSource} />
            </div>
        )
    }
}

export default MusicPlayer