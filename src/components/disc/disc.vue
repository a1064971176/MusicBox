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
      songs: [],
      reqId:'b0aeb760-a90d-11e9-ab0a-f511ed1676be',
    };
  },
  computed: {
    title() {
      return this.disc.name;
    },
    bgImage() {
      return this.disc.img700;
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
      let data={
        pid:disc.id,
        pn:1,
        rn:30,
        reqId:this.reqId
      }
      getSongList(data).then(res => {
            if(res.data.code===200){
              this.songs=res.data.data.musicList
              this.reqId=res.data.reqId
              }
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
 .slide-enter-active, .slide-leave-active{
    transition: all 0.3s}

  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)}
</style>
