<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import { mapState } from "vuex";
import { getSongList } from "@/service/getData.js";

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.disc.name;
    },
    bgImage() {
      return this.disc.picUrl;
    },
    ...mapState(["disc"])
  },
  created() {
    this._getSongList(this.disc);
  },
  methods: {
    _getSongList(disc) {
      // console.log(disc.id);
      if (!disc.id) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(disc.id).then(res => {
            if(res.data.code===200)this.songs=res.data.playlist.tracks
        // console.log(this.songs);
      });
    }
  },
  components: {
    MusicList
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/variable.scss';
// .singer-detail{
//     position: fixed;
//     z-index: 100;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: $color-background
// }
 .slide-enter-active, .slide-leave-active{
    transition: all 0.3s}

  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)}
</style>
