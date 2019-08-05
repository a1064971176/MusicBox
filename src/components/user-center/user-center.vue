<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
          <switches @switch="SwitchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="randonm">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
          <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex==0" :data="favoriteList">
            <div class="list-inner">
              <song-list :songs="favoriteList" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll
            ref="playList"
            v-if="currentIndex===1"
            class="list-scroll"
            :data="playHistory"
          >
            <div class="list-inner">
             <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
          <noresult :title="noResultDesc"></noresult>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from '@/base/switches/switches.vue';
import Scroll from "@/base/scroll/scroll.vue";
import Noresult from "@/base/no-result/no-result.vue";
import SongList from "@/base/song-list/song-list.vue";
import { mapState, mapActions } from 'vuex';
import { playlistMixin } from "@/assets/js/mixin.js";

export default {
    mixins: [playlistMixin],
    data() {
        return {
            currentIndex:0,
            switches:[
                {name:"我喜欢的"},
                {name:"最近听的"}
            ]
        }
    },
    methods:{
         handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? "60px" : "";
            this.$refs.listWrapper.style.bottom = bottom;
            this.$refs.favoriteList&&this.$refs.favoriteList.refresh();
            this.$refs.playList&&this.$refs.playList.refresh();
            },
        SwitchItem(index){
            this.currentIndex=index
        },
        selectSong({list,index}){
            this.insertSong(list)
        },
        back(){
            this.$router.back()
        },
        randonm(){
            let list=this.currentIndex==0?this.favoriteList:this.playHistory
                if(!list.length)return
            this.randomPlay({list})
        },
        ...mapActions(["insertSong","randomPlay"])
    },
    computed:{
        noResult(){
            if(this.currentIndex==0){
                return !this.favoriteList.length
            }else{
                return !this.playHistory.length
            }
        },
        noResultDesc(){
             if(this.currentIndex==0){
                return "暂无收藏歌曲"
            }else{
                return "你还没有听过歌曲"
            }
        },
        ...mapState(["favoriteList","playHistory"])
    },
    components:{
        Switches,Scroll,SongList,Noresult
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable.scss";

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
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

