import { createStore } from 'redux';
import userInfoReducer from "./reducers/userInfoReducer"
import AudioPlayerReducer from "./reducers/AudioPlayerReducer"
import QueueReducer from "./reducers/QueueReducer"

const RegisterStore = createStore(userInfoReducer);

export const AudioPlayerStore = createStore(AudioPlayerReducer);

export const QueueStore = createStore(QueueReducer);



module.exports = {
    RegisterStore,
    AudioPlayerStore,
    QueueStore
};

// const store = createStore(rootReducer);

// export default store;