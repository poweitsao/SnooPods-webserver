import { createStore } from 'redux';
import userInfoReducer from "./reducers/userInfoReducer"
import AudioPlayerReducer from "./reducers/AudioPlayerReducer"

const RegisterStore = createStore(userInfoReducer);

const AudioPlayerStore = createStore(AudioPlayerReducer);

module.exports = {
    RegisterStore,
    AudioPlayerStore
};

// const store = createStore(rootReducer);

// export default store;