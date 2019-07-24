<template>
  <scroll class="suggest" :data="result" :beforeScroll="beforeScroll" :pullup="pullup" @scrollToEnd="searchMore" @beforeScroll="listScroll" ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{item.name}} - {{item.artist}}</p>
        </div>
      </li>
      <li>
      <loading v-show="hasMore" title></loading>

      </li>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore&&!result.length">
      <no-result title="抱歉,暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search,getSong } from "@/service/getData.js";
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import NoResult from "@/base/no-result/no-result";
import {mapActions} from "vuex"
export default {
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      limit: 30,
      page: 1,
      // type: 1, //1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
      result: [],
      pullup: true, //下拉加载
      beforeScroll:true,//监听beforeScroll事件
      hasMore: true,
      reqId: "d27a1da0-adf2-11e9-af26-5d25fa2f5411"
    };
  },
  // showSinger: {
  //   type: Boolean,
  //   default: true
  // },
  methods: {
    _search() {
      this.page = 1;
      this.result=[];
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0,0)
      let data = {
        key: this.query,
        pn:this.page,
        rn:this.limit,
        reqid:this.reqid
      };
      if (data.key.length) {
        search(data).then(res => {
          if (res.data.code === 200) {
            this.result = res.data.data.list||[];
            if(res.data.data.total==0)return this.hasMore = false;
            if (res.data.data.total < this.limit) this.hasMore = false;
          }
        });
      }
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      let item = {
         key: this.query,
        pn:this.page,
        rn:this.limit,
        reqid:this.reqid
      };
      if (item.key.length) {
        search(item).then(res => {
          if (res.data.code === 200) {
            this.result = this.result.concat(res.data.data.list);
            if (res.data.data.total < this.page*this.limit) this.hasMore = false;
          }
        });
      }
    },
    refresh(){
      this.$refs.suggest.refresh()
    },
    listScroll(){
      this.$emit("listScroll")
    },
    // desc(song) {
    //   return song.artists
    //     .map(val => val.name)
    //     .reduce((a, b) => {
    //       return a + " / " + b;
    //     });
    // },
    selectItem(item){
      getSong(item.id).then((res)=>{
        if(res.data.code===200){
        this.insertSong(res.data.songs[0])
        this.$emit("select")
        }
      })
    },
    ...mapActions(["insertSong"])
  },
  watch: {
    query() {
      // console.log(1);
      this._search();
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>

<style scoped lang="scss" scope>
@import "@/assets/css/variable.scss";
@import "@/assets/css/mixin.scss";

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }
    .icon {
      flex: 0 0 30px;
      width: 30px;
      // [class^="icon-"]
      [class^="icon-"] {
        font-size: 14px;
        color: $color-text-d;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;
      .text {
        @include no-wrap();
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
