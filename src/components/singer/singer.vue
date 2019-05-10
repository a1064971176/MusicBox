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
            <img height="60" v-lazy="item.picUrl">
          </div>
          <div class="text">
            <h2 class="name">{{item.name}}</h2>
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
import { mapMutations } from "vuex";
import { playlistMixin } from "@/assets/js/mixin.js";
import { setTimeout } from "timers";

export default {
  mixins: [playlistMixin],

  data() {
    return {
      singers: [],
      limit: 30,
      page: 0,
      pullup: true,
      showMore: true
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
      //   this.setsinger(singer);
      this.$store.commit("setSinger", singer);
    },
    _getSingerList() {
      let offset = this.page * this.limit;
      // this.showLoading = true;
      getSingerList(offset, this.limit).then(res => {
          if (res.data.code === 200) {
            this.singers.push(...res.data.artists);
            if (res.data.artists.length == this.limit) {
              this.page++;
            } else {
              this.showMore = false;
            }
          }
          // this.showLoading=false
        });
    }
  },
  ...mapMutations({
    setsinger: "SET_SINGER"
  }),
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
        }
        .desc {
          color: $color-text-d;
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
