import {playMode} from '@/assets/js/config'
import {loadSearch, loadPlay, loadFavorite} from '@/assets/js/cache'
const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    currentLyric:"",
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    // searchHistory: [],
    playHistory: loadPlay(),
    favoriteList: loadFavorite()
    
}
export default state