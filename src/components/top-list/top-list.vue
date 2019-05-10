<template>
  <transition name="slide">
    <music-list :title="title" :rank="rank" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import { mapState } from "vuex";
import { getMusicList } from "@/service/getData.js";
export default {
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  computed: {
    title() {
      return this.topList.name;
    },
    bgImage() {
       if (this.songs.length) {
          return this.songs[0].al.picUrl
        }
        return ''
    },
    ...mapState(["topList"])
  },
  created() {
    this._getTopList();
  },
  methods: {
    _getTopList() {
      if (!(this.topList.idx+1)) {
        this.$router.push("/rank");
        return;
      }
      getMusicList(this.topList.idx).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.songs = res.data.playlist.tracks;
        }
      });
    }
  },

  components: {
    MusicList
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
