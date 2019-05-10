import { getSong } from "@/service/getData";
import { playMode } from "@/assets/js/config.js";
import { shuffle } from "@/assets/js/util.js";
import { saveSearch,deleteSearch,clearSearch } from "@/assets/js/cache.js";

// const actions = {

function findIndex(list, song) {
  // console.log(list,song)
  return list.findIndex(item => {
    return item.id === song.id;
  });
}
export const selectPlay = ({ commit, state }, { list, index }) => {
  // console.log(list,index)

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

  // console.log(list[index])
};
export const setFullScreen = ({ commit }, flag) => {
  commit("setFullScreen", flag);
};
export const randomPlay = ({ commit }, { list }) => {
  commit("setPlayMode", playMode.random);
  commit("setSequenceList", list);
  let randomList = shuffle(list);
  commit("setPlayList", list);
  commit("setCurrentIndex", 0);
  commit("setFullScreen", true);
  commit("setPlayingState", true);
};
// }
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

export const saveSearchHistory = ({commit},query) => {
  commit("setSearchHistory",saveSearch(query))
};
export const deleteSearchHistory = ({commit},query) => {
  commit("setSearchHistory",deleteSearch(query))
};
export const clearSearchHistory = ({commit}) => {
  commit("setSearchHistory",clearSearch())
};