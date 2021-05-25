import { createStore } from 'redux';
import registerReducer from "./reducers/registerReducer"
import AudioPlayerReducer from "./reducers/AudioPlayerReducer"
import QueueReducer from "./reducers/QueueReducer"
import userSessionInfoReducer from "./reducers/userSessionInfoReducer"

export const RegisterStore = createStore(registerReducer);

export const AudioPlayerStore = createStore(AudioPlayerReducer);

export const QueueStore = createStore(QueueReducer);

export const UserSessionStore = createStore(userSessionInfoReducer);




module.exports = {
    RegisterStore,
    AudioPlayerStore,
    QueueStore,
    UserSessionStore
};

// const store = createStore(rootReducer);

// export default store;