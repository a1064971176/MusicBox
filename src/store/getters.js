import { groupPatternsByBaseDirectory } from "fast-glob/out/managers/tasks";

const getters = {
    currentSong: (state) => {
            return state.playlist[state.currentIndex]||{}
        
    },
    currentSongId: (state, getters) => {
        return getters.currentSong.id 
    },
    currentSongName: (state, getters) => {
        return getters.currentSong.name || null
    },
    currentSongImg: (state, getters) => {
        if(getters.currentSong.al)
        return getters.currentSong.al.picUrl || null
    },
    currentSonger: (state, getters) => {
        if(getters.currentSong.ar)
        return getters.currentSong.ar.map(val => val.name).reduce((a, b) => {
          return a + " - " + b;
        })||null;
    },
    currentSongUrl: (state, getters) => {
        if (getters.currentSongId) {
            return `https://music.163.com/song/media/outer/url?id=${getters.currentSongId}.mp3`
        }else{
            return null
        }
        
    },
    sequenceList:(state)=>{
        return state.sequenceList
    }
   

}
export default getters