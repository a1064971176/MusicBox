<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm()">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll :data="sequenceList" class="list-content" ref="listContent">
          <transition-group name="list" tag="ul">
            <li
              class="item"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click="selectItem(item,index)"
              ref="lisrItem"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import { playMode } from "@/assets/js/config.js";
import Scroll from "@/base/scroll/scroll";
import { setTimeout } from "timers";
import Confirm from "@/base/confirm/confirm";
import AddSong from "@/components/add-song/add-song";

import { playerMixin } from "@/assets/js/mixin.js";

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    //显示列表
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSongId);
      }, 20);
    },
    //隐藏列表
    hide() {
      this.showFlag = false;
    },
    //当前播放歌曲显示图标
    getCurrentIcon(item) {
      if (this.currentSongId === item.id) {
        return "icon-play";
      }
      return "";
    },
    //选择歌曲
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        console.log(12)
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    //滚动到当前播放项
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current === song.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.lisrItem[index], 300);
    },
    //删除
    deleteOne(item) {
      console.log(item)
      this.deleteSong(item);
      if(!this.playlist.length) this.hide()
    },
    //显示确定框
    showConfirm(){
      console.log(1)
      this.$refs.confirm.show()
      console.log(2)
    },
    confirmClear(){
      this.deleteSongList()
      this.hide()
    },
    addSong(){
      this.$refs.addSong.show()
    },
    // ...mapMutations(["setCurrentIndex", "setPlayingState"]),
    ...mapActions(["deleteSong", "deleteSongList"])
  },
  watch: {
    currentSongId(newId, oldId) {
      if(!newId) return
      if (!this.showFlag || newId === oldId) return;
      this.scrollToCurrent(newId);
    }
  },
  computed: {
    modeText(){
      return this.mode===playMode.sequence?'顺序播放':this.mode===playMode.random?'随即将播放':'单曲循环'
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable.scss";
@import "@/assets/css/mixin.scss";
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .like {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }
    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
