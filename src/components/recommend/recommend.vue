<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="banners.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in banners" :key="index">
              <a :href="item.url">
                <img class="needsclick" :src="item.pic" @load="loadImage">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" :key="index" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.img" alt width="60" height="66">
              </div>
              <div class="text">
                <h2 class="name">{{item.name}}</h2>
                <p class="desc">{{item.info}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Loading from "@/base/loading/loading";
import Scroll from "@/base/scroll/scroll";
import { getRecommend, getDiscList } from "@/service/getData.js";
import Slider from "@/base/slider/slider";
import { playlistMixin } from "@/assets/js/mixin.js";
import {mapMutations} from "vuex"
export default {
  mixins: [playlistMixin],
  data() {
    return {
      banners: [],
      discList: [],
      reqId:"b94ae990-a3c5-11e9-94a9-6f41d3eb5db3"
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";

      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selectItem(item){
      // console.log(item)
      this.setDisc(item)
      this.$router.push(`/recommend/${item.id}`)
    },
    //处理字符串
    // descriptionSlice(cont) {
    //   if (cont.indexOf("编辑") !== -1) {
    //     return cont.slice(5);
    //   } else {
    //     return cont;
    //   }
    // },
    
    //获取banner
    _getRecommend() {
      let data={
        reqId:this.reqId
      }
      getRecommend(data).then(res => {
        if (res.data.code === 200) {
          this.banners = res.data.data;
          this.reqId=res.data.reqId
        }
      });
    },

    //获取每日推荐
    _getDiscList() {
      let data={
        loginUid:0,
        reqId:this.reqId
      }
      getDiscList(data).then(res => {
        if (res.data.code === 200) {
          this.discList = res.data.data.list;
          this.reqId=res.data.reqId
        }
      });
    },

    //
    loadImage() {
      if (!this.checkloaded) {
        this.$refs.scroll.refresh();
        this.checkloaded = true;
      }
    },
    ...mapMutations(["setDisc"])
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable.scss";
@import "@/assets/css/mixin.scss";

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
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
            @include no-wrap();
            margin-bottom: 10px;
            color: $color-text;
          }
          .desc {
            @include no-wrap();
            color: $color-text-d;
          }
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
