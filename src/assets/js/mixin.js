import { mapState,mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from './config'
import {shuffle} from './util'

export const playlistMixin = {
  computed: {
    ...mapState([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode == playMode.sequence
        ? "icon-sequence"
        : this.mode == playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    ...mapState(["playlist", "mode"]),
    ...mapGetters([
      "currentSongUrl",
      "currentSongName",
      "currentSongImg",
      "currentSonger",
      "currentSongId",
      "sequenceList"
    ])
  },
  methods: {
    //改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.setPlayList(list);
      this.rseetCurrentIndex(list);
    },
    rseetCurrentIndex(list) {
      // console.log(list)
      let index = list.findIndex((item, inde) => {
        return item.id === this.currentSongId;
      });
      this.setCurrentIndex(index);
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations([
      "setPlayingState",
      // "setFullScreen",
      "setCurrentIndex",
      "setPlayMode",
      "setPlayList"
    ]),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      // showFlag: false,
      query:''
    };
  },
  computed: {
    ...mapState(["searchHistory"])
  },
  methods: {
    addQuery(query) {
      this.$refs.SearchBox.setQuery(query);
    },
    oneQueryChange(query) {
      this.query = query;
    },
    blurInput() {
      this.$refs.SearchBox.blur();
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    // addQuery(query) {
    //   this.$refs.searchBox.setQuery(query)
    // },
    // saveSearch() {
    //   this.saveSearchHistory(this.query)
    // },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
