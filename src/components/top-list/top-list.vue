<template>
  <transition name="slide">
    <music-list :title="title" :rank="rank" :bgImage="bgImage" :songs="songs" :showMore="showMore" @scroll="scrollToEnd"></music-list>
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
      rank: true,
      showMore: true,
      page:1,
      limit:30,
    };
  },
  computed: {
    title() {
      return this.topList.name;
    },
    bgImage() {
       if (this.songs.length) {
          return this.songs[0].pic
          // return this.topList.pic
        }
          return this.topList.pic
    },
    ...mapState(["topList"])
  },
  created() {
    this._getTopList();
  },
  methods: {
    scrollToEnd(){
      if (this.showMore) this. _getTopList();
    },
    _getTopList() {
      if (!this.topList.sourceid) {
        this.$router.push("/rank");
        return;
      }
      let data = {
        bangId:this.topList.sourceid,
        pn:this.page,
        rn:this.limit,
        reqId: this.reqId
      };
      getMusicList(data).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
           this.songs.push(...res.data.data.musicList);
          // this.songs = res.data.data.musicList;
          this.reqId = res.data.reqId
           if (res.data.data.num > this.limit*this.page) {
              this.page++;
            } else {
              this.showMore = false;
            }
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
