import { createStore } from 'redux';
import registerReducer from "./reducers/registerReducer"
import AudioPlayerReducer from "./reducers/AudioPlayerReducer"
import QueueReducer from "./reducers/QueueReducer"

export const RegisterStore = createStore(registerReducer);

export const AudioPlayerStore = createStore(AudioPlayerReducer);

export const QueueStore = createStore(QueueReducer);



module.exports = {
    RegisterStore,
    AudioPlayerStore,
    QueueStore
};

// const store = createStore(rootReducer);

// export default store;