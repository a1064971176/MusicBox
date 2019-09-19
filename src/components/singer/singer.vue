<template>
  <div class="singer" ref="singer">
    <scroll
      :data="singers"
      pullup="pullup"
      class="singers"
      ref="singers"
      @scrollToEnd="scrollToEnd()"
    >
      <ul>
        <li class="item" v-for="item in singers" :key="item.id" @click="selectSinger(item)">
          <div class="icon">
            <img height="60" v-lazy="item.pic70">
          </div>
          <div class="text">
            <h2 class="name">{{item.name}}<span v-if="item.aartist"> ({{item.aartist}})</span></h2>
            <p class="desc">单曲 {{item.musicNum}} 专辑 {{item.albumNum}} MV {{item.mvNum}}</p>
          </div>
        </li>
        <li>
          <!-- <div class="loading-container item" v-show="singers.length&&showMore"> -->
            <loading v-show="singers.length&&showMore"></loading>
          <!-- </div> -->
        </li>
      </ul>
      <div class="loading-container" v-show="!singers.length">
        <loading></loading>
      </div>
    </scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Loading from "@/base/loading/loading";
import Scroll from "@/base/scroll/scroll";
import { getSingerList } from "@/service/getData.js";
import { mapState,mapGetters, mapMutations, mapActions} from 'vuex'
import { playlistMixin } from "@/assets/js/mixin.js";
import { setTimeout } from "timers";

export default {
  mixins: [playlistMixin],

  data() {
    return {
      singers: [],
      limit: 100,
      page: 1,
      pullup: true,
      showMore: true,
      reqId:'fefe3260-a93a-11e9-87f1-fdc693fc7a5a'
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.singers.refresh();
    },
    scrollToEnd() {
      if (this.showMore) this._getSingerList();
    },
    selectSinger(singer) {
      this.$router.push(`/singer/${singer.id}`);
      this.setSinger(singer);
      // this.$store.commit("setSinger", singer);
    },
    _getSingerList() {
      let data={
        category:0,
        pn:this.page,  
        rn:this.limit,
        reqId:this.reqId
      }
      // let offset = this.page * this.limit;
      // this.showLoading = true;
      getSingerList(data).then(res => {
          if (res.data.code === 200) {
            this.singers.push(...res.data.data.artistList);
            if (res.data.data.total > this.limit*this.page) {
              this.page++;
            } else {
              this.showMore = false;
            }
          }
          // this.showLoading=false
        });
    },
  ...mapMutations(["setSinger"]),
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable.scss";

.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  .singers {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 65px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 60px;
        // width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 20px;
        overflow: hidden;
        // img{
        // transform: translateX(-10px)
        // }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        font-size: $font-size-medium;
        .name {
          margin-bottom: 10px;
          color: $color-text;
          span{
              color: $color-text-d;
          }
        }
        .desc {
          color: $color-text-d;
          font-size: $font-size-small
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
