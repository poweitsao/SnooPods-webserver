import useSwr from 'swr'


function ShowMusicPlayer(props) {

    const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json())
    if (props.audioSource.subreddit && props.audioSource.podcast) {
        console.log(props.audioSource.subreddit)
        const { data, error } = useSwr('/api/podcasts/' + props.audioSource.subreddit + '/' + props.audioSource.podcast, fetcher, { revalidateOnMount: true })
        if (error) {
            console.log(error)
        }
        if (!data) {
            console.log("No data")
            return (<div>Loading... </div>);
        }

        return (
            <audio controls={true} autoPlay={false} name="media" src={data.cloud_storage_url} type="audio/mpeg"></audio>

        );
    }
    return (<div>Click the button to play a podcast!</div>);
}

class MusicPlayer extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div>
                {/* <audio controls="true" autoplay="false" name="media" src={this.state.audioSource} type="audio/mpeg"></audio> */}
                <ShowMusicPlayer audioSource={this.props} />
            </div>
        )
    }
}

export default MusicPlayer