import { combineReducers } from 'redux';
import AudioPlayerReducer from "./AudioPlayerReducer"
import CollectionReducer from './CollectionReducer';
import LikedTracksReducer from "./LikedTracksReducer"
import QueueReducer from "./QueueReducer"
import registerReducer from "./registerReducer"
import SubListReducer from "./SubListReducer"
import userSessionInfoReducer from "./userSessionInfoReducer"
import historyReducer from "./HistoryReducer"
import VolumeReducer from "./VolumeReducer"
import volumeReducer from './VolumeReducer';


const rootReducer = combineReducers({
    audioPlayerInfo: AudioPlayerReducer,
    collectionInfo: CollectionReducer,
    likedTracksInfo: LikedTracksReducer,
    queueInfo: QueueReducer,
    registerInfo: registerReducer,
    subListInfo: SubListReducer,
    userSessionInfo: userSessionInfoReducer,
    historyInfo: historyReducer,
    volumeInfo: volumeReducer

});

export default rootReducer;