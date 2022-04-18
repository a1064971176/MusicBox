<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="banners.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in banners" :key="index">
              <a :href="item.url">
                <img class="needsclick" :src="item.pic" @load="loadImage" />
              </a>
            </div>
          </slider>
        </div>
        <switches :switches="switches" :currentIndex="Index" @switch="switchItem"></switches>
        <div class="recommend-list" v-if="Index == 0">
          <!-- <h1 class="list-title">热门歌单推荐</h1> -->
          <ul class="items">
            <li v-for="(item, index) in discList" :key="index" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.picUrl+'?param=500y500'" alt width="100%" />
              </div>
              <div class="text">
                <h2 class="name">{{item.name}}</h2>
                <p class="desc">{{item.copywriter}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="recommend-list" v-if="Index == 1">
          <!-- <h1 class="list-title">主播电台</h1> -->
          <ul class="items">
            <li v-for="(item, index) in radiolist" :key="index" class="item" @click="selectRadioItem(item)">
              <div class="icon">
                <img v-lazy="item.picUrl+'?param=500y500'" alt width="100%" />
              </div>
              <div class="text">
                <h2 class="name">{{item.name}}</h2>
                <p class="desc">{{item.copywriter}}</p>
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
import Loading from '@/base/loading/loading'
import Scroll from '@/base/scroll/scroll'
import {
  getRecommend,
  getDiscList,
  getRadioList,
  getSong
} from '@/service/getData.js'
import Slider from '@/base/slider/slider'
import { playlistMixin } from '@/assets/js/mixin.js'
import { mapMutations, mapActions } from 'vuex'
import Switches from '@/base/switches/switches.vue'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      Index: 0,
      switches: [{ name: '热门歌单推荐' }, { name: '主播电台' }],
      banners: [],
      discList: [],
      radiolist: [],
      reqId: 'd67e44e0-daa1-11e9-9f14-cf8c3cf14acf'
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
    this._getRadioList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      // console.log(item)
      this.setDisc(item)
      this.$router.push(`/recommend/${item.id}`)
    },
    selectRadioItem(item) {
      let data = {
        mid: item.rid,
        reqId: this.reqId
      }

      getSong(data).then(res => {
        if (res.data.code === 200) {
          this.insertSong(res.data.data)
        }
      })
    },
    switchItem(index) {
      this.Index = index
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
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
      let data = {
        type: 1 // 0: pc 1: android 2: iphone 3: ipad
      }
      getRecommend(data).then(res => {
        if (res.data.code === 200) {
          this.banners = res.data.banners
          // this.reqId = res.data.reqId
        }
      })
    },

    //获取每日推荐
    _getDiscList() {
      let data = {
        limit: 30
        // reqId: this.reqId/
      }
      // return
      getDiscList(data).then(res => {
        if (res.data.code === 200) {
          this.discList = res.data.result
          // this.reqId = res.data.reqId
        }
      })
    },
    //获取主播电台
    _getRadioList() {
      let data = {
        limit: 30
        // loginUid:0,
        // reqId: this.reqId
      }
      getRadioList(data).then(res => {
        if (res.data.code === 200) {
          this.radiolist = res.data.djRadios
          // this.reqId = res.data.reqId
        }
      })
    },

    //
    loadImage() {
      if (!this.checkloaded) {
        this.$refs.scroll.refresh()
        this.checkloaded = true
      }
    },
    ...mapActions(['insertSong']),
    ...mapMutations(['setDisc'])
  },
  components: {
    Slider,
    Scroll,
    Loading,
    Switches
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variable.scss';
@import '@/assets/css/mixin.scss';

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
      .items {
        display: flex;
        flex-flow: wrap;
        justify-content: space-around;
      }
      .item {
        width: 30vw;
        // height: 40vw;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        // padding: 0 20px 20px 20px;
        flex-direction: column;
        .icon {
          //   flex: 0 0 60px;
          width: 30vw;
          height: 30vw;
          border-radius: 10px;
          overflow: hidden;
          //   padding-right: 20px;
        }
        .text {
          //   display: flex;
          //   flex-direction: column;
          //   justify-content: center;
          //   flex: 1;
          width: 100%;
          height: 55px;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            @include text-over();
            margin-top: 5px;
            color: $color-text;
            text-align: center;
          }
          .desc {
            display: none;
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
