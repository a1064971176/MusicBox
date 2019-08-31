<template>
  <div class="player" v-show="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img alt width="100%" height="100%" :src="currentSongImg" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSongName"></h1>
          <h2 class="subtitle" v-html="currentSonger"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img alt class="image" :src="currentSongImg" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{'current':currentLineNume===index}"
                  v-for="(line,index) in currentLyric.lines"
                  :key="index"
                >{{line.lineLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span :class="['dot',{'active':currentShow==='cd'}]"></span>
            <span :class="['dot',{'active':currentShow==='lyric'}]"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="tiem time-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" :class="cdCls">
          <img alt width="40" height="40" :src="currentSongImg" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSongName"></h2>
          <p class="desc" v-html="currentSonger"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="Playlist"></playlist>
    <audio
      :src="currentSongUrl"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updataTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "@/assets/js/dom.js";
import progressBar from "@/base/progress-bar/progress-bar";
import progressCircle from "@/base/progress-circle/progress-circle";
import { playMode } from "@/assets/js/config.js";
// import { shuffle } from "@/assets/js/util.js";
import Lyric from "@/assets/js/lyric.js";
import Scroll from "@/base/scroll/scroll";
import { truncate } from "fs";
import { getLyric, getMusic } from "@/service/getData";
import Playlist from "@/components/playlist/playlist";

import { playerMixin } from "@/assets/js/mixin.js";
import { constants } from 'crypto';

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");
export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      duration: 0,
      radius: 32,
      currentLyric: null,
      currentLineNume: 0,
      currentShow: "cd",
      playingLyric: "",
      reqId:"32779950-aea0-11e9-bded-712fbe598268",
      currentSongUrl:""
    };
  },
  created() {
    this.touch = {};
  },
  methods: {
    //点击mini播放器
    open() {
      // this.$store.dispatch("setFullScreen", true);
      this.setFullScreen(true);
    },
    //点击返回
    back() {
      // this.$store.dispatch("setFullScreen", false);
      this.setFullScreen(false);
    },

    //===========================切换动画
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      }),
        animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    //播放列表
    showPlaylist() {
      this.$refs.Playlist.show();
    },
    //歌词和播放界面切换
    middleTouchStart(e) {
      this.touch.initiated = true;
      // 用来判断是否是一次移动
      // this.touch.moved = false
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      this.touch.initiated = false;
    },
    //=====================播放控制
    //audio是canplay状态
    ready() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong)
    },
    //audio是error状态
    error() {
      this.songReady = true;
    },
    //点击切换播放状态
    togglePlaying() {
      if (!this.songReady) return;
      this.setPlayingState(!this.playing);
      //设置歌词状态
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      //将时间设置为0,并执行播放
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      //将歌词重置
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    //点击下一首
    next() {
      if (!this.songReady) return; //判断是否可以播放
      if (this.playlist.length === 1) {
        //如果列表长度为1 单曲循环
        this.loop();
        return
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) index = 0; //超过列表长度后重置
        this.setCurrentIndex(index);
        
        if (!this.playing) this.togglePlaying(); //如果为暂停状态,改为播放状态
        this.songReady = false; //将状态改为不可点击
      }
    },
    //点击上一首
    prev() {
      if (!this.songReady) return; //判断是否可以播放
      if (this.playlist.length === 1) {
        //如果列表长度为1 单曲循环
        this.loop();
        return
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) index = this.playlist.length - 1; //小于0后设置为最后一首
        this.setCurrentIndex(index);
        if (!this.playing) this.togglePlaying(); //如果为暂停状态,改为播放状态
        this.songReady = false; //将状态改为不可点击
      }
    },
    //播放位置更新时,设置currentTime和allTime
    updataTime(e) {
      this.currentTime = e.target.currentTime;
      this.duration = e.target.duration;
    },
    //时间转换为00:00
    format(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    //补0
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    //跳转到进度条对应的播放进度
    onProgressBarChange(percent) {
      const currentTime = this.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) this.togglePlaying();
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    getUrl(){
      let data={
            format:'mp3',
            rid:this.currentSongId,
            response:'url',
            type:'convert_url3',
            br:'128kmp3',//320kmp3
            from:'web',
            t:new Date().getTime(),
            reqId: this.reqId
          }
        getMusic(data).then(res=>{
            if(res.data.code=200){
              this.currentSongUrl=res.data.url
            }
          })
    },
    getLyric(id) {
      let data={
        musicId:id,
        reqid:this.reqId
      }
      getLyric(data).then(res => {
         let newlyc;
        if(res.data.data.lrclist){
          newlyc=res.data.data.lrclist.map(val=>{
            val.time=val.time*1000
            return val
          })
        }else{
          newlyc=[{lineLyric:"暂无歌词",time:0}]
        }
          this.currentLyric = new Lyric(newlyc, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
          // console.log(this.currentLyric);
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNume = lineNum;
      if (lineNum > 5) {
        // console.log(this.$refs.lyricLine);
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    ...mapMutations([
      // "setPlayingState",
      "setFullScreen",
      // "setCurrentIndex",
      // "setPlayMode",
      // "setPlayList"
    ]),
    ...mapActions(["savePlayHistory"])
  },
  computed: {
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    percent() {
      return this.currentTime / this.duration;
    },
    ...mapState([
      "fullScreen",
      // "playlist",
      "playing",
      // "currentIndex",
      // "mode",
      // "sequenceList"
    ]),
    ...mapGetters([
      // "currentSongUrl",
      // "currentSongName",
      // "currentSongImg",
      // "currentSonger",
      // "currentSongId"
    ])
  },
  watch: {
    currentSongId(){
      document.title=`${this.currentSongName} - ${this.currentSonger}`
       this.getUrl()
    },
    //监听音乐url变化  执行播放
    currentSongUrl(newUrl) {
      if(!newUrl) return
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      this.getLyric(this.currentSongId);
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    //监听playing变化  改变播放器状态
    playing(newPlaying) {
      // console.log(newPlaying)
      const audio = this.$refs.audio;
      // console.log(audio)
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    progressBar,
    progressCircle,
    Scroll,
    Playlist
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable.scss";
@import "@/assets/css/mixin.scss";

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 10px;
      margin-left: 10px;
      img {
        border-radius: 50%;
      }
      &.play {
        animation: rotate 10s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>