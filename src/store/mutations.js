import * as types from './mutation-types'
const mutations = {

    setSinger(state, singer) {
        state.singer = singer
    },
    setPlayingState(state, flag) {
        state.playing = flag
    },
    setFullScreen(state, flag) {
        state.fullScreen = flag
    },
    setPlayList(state, list) {
        state.playlist = list
    },
    setSequenceList(state, list) {
        state.sequenceList = list
    },
    setPlayMode(state, mode) {
        state.mode = mode
    },
    setCurrentIndex(state, index) {
        state.currentIndex = index
    },
    
    // [types.SET_PLAYING_STATE](state, flag) {
    //     state.playing = flag
    //   },
    // [types.SET_FULL_SCREEN](state, flag) {
    //     state.fullScreen = flag
    // },
    setDisc(state, disc) {
        state.disc = disc
    },
    setTopList(state, topList) {
        state.topList = topList
    },
    setSearchHistory(state, history) {
        state.searchHistory = history
    },
    setPlayHistory(state, history) {
        state.playHistory = history
    },
    // setFavoriteList(state, list) {
    //     state.favoriteList = list
    // }
}
export default mutations