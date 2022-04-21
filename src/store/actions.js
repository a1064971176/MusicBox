import { getSong } from "@/service/getData";
import { playMode } from "@/assets/js/config.js";
import { shuffle } from "@/assets/js/util.js";
import { saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite } from "@/assets/js/cache.js";


function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  });
}
export const selectPlay = ({ commit, state }, { list, index }) => {
  commit("setSequenceList", list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit("setPlayList", randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit("setPlayList", list);
  }

  commit("setCurrentIndex", index);
  commit("setFullScreen", true);
  commit("setPlayingState", true);
};
//全屏
export const setFullScreen = ({ commit }, flag) => {
  commit("setFullScreen", flag);
};
//随机播放
export const randomPlay = ({ commit }, { list }) => {
  commit("setPlayMode", playMode.random);
  commit("setSequenceList", list);
  let randomList = shuffle(list);
  commit("setPlayList", list);
  commit("setCurrentIndex", 0);
  commit("setFullScreen", true);
  commit("setPlayingState", true);
};
//插入 歌曲
export const insertSong = ({ commit, state }, song) => {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  //记录当前歌曲
  let currentSong = playlist[currentIndex];
  //查找当前列表是否有待插入的歌曲,并返回索引
  // console.log(playlist, song)
  let fpIndex = findIndex(playlist, song);
  //因为是插入歌曲,所以索引+1
  currentIndex++;
  //插入这首歌到当前所以位置
  playlist.splice(currentIndex, 0, song);
  //如果已经包含了这首歌
  if (fpIndex > -1) {
    //如果当前插入的索引大于原来的索引
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  commit("setPlayList", playlist);
  commit("setSequenceList", sequenceList);
  commit("setCurrentIndex", currentIndex);
  commit("setFullScreen", true);
  commit("setPlayingState", true);
};
//保存搜索历史
export const saveSearchHistory = ({ commit }, query) => {
  commit("setSearchHistory",saveSearch(query))
};
//删除搜索历史
export const deleteSearchHistory = ({commit},query) => {
  commit("setSearchHistory",deleteSearch(query))
};
//清除搜索历史
export const clearSearchHistory = ({commit}) => {
  commit("setSearchHistory",clearSearch())
};
//删除歌曲
export const deleteSong=({commit,state},song)=>{
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  let pIndex=findIndex(playlist,song)
  playlist.splice(pIndex,1)

  let sIndex=findIndex(sequenceList,song)
  sequenceList.splice(sIndex,1)
  // if(pIndex==-1) return //阻止 删除列表最后一个  会调用两次 ???(为什么删最后一个调用两次)
  if(currentIndex>pIndex||currentIndex===playlist.length){currentIndex--}
  commit("setPlayList", playlist);
  commit("setSequenceList", sequenceList);
  commit("setCurrentIndex", currentIndex);
  // commit("setPlayingState", false);
  const setPlayingState=playlist.length>0
  commit("setPlayingState", setPlayingState)
}

export const deleteSongList=({commit})=>{
  commit("setPlayList", []);
  commit("setSequenceList", []);
  commit("setCurrentIndex", -1);
  commit("setPlayingState", false)
}

export const savePlayHistory=({commit},song)=>{
  commit("setPlayHistory", savePlay(song));
}
export const saveFavoriteList=({commit},song)=>{
  commit("setFavoriteList", saveFavorite(song));
}
export const deleteFavoriteList=({commit},song)=>{
  commit("setFavoriteList", deleteFavorite(song));
}