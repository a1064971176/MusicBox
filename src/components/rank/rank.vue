<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img width="60" height="66" v-lazy="item.coverImgUrl">
          </div>
          <div class="text">
            <h2 class="name">{{item.name}}</h2>
            <p class="desc">{{item.updateFrequency}}</p>
          </div>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Loading from "@/base/loading/loading";
import Scroll from "@/base/scroll/scroll";
import { getTopList } from "@/service/getData.js";
import { playlistMixin } from "@/assets/js/mixin.js";
import {TopInfo} from "@/assets/js/top-info.js";
import {mapMutations} from "vuex"
export default {
  mixins: [playlistMixin],
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";

      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    },
     selectItem(item){
      this.setTopList(item)
       this.$router.push(`/rank/${item.idx}`)
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.data.code === 200) {
          const newList=res.data.list.map((val)=>{
            let idx=TopInfo.findIndex((item)=>{
              return item.item==val.name
            })
            val.idx=idx
           return val
          })
          this.topList = res.data.list;
          // console.log(res);
        }
      });
    },
    ...mapMutations([
      'setTopList'
    ])
   
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable.scss";

@import "@/assets/css/mixin.scss";
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
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

