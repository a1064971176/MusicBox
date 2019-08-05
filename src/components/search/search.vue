<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="SearchBox" @query="oneQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门收搜</h1>
            <ul>
              <li
                class="item"
                @click="addQuery(item)"
                v-for="(item, index) in hotKey"
                :key="index"
              >
                <span>{{item}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" @select="saveSearch" @listScroll="blurInput" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from "@/base/search-box/search-box";
import SearchList from "@/base/search-list/search-list";
import Confirm from "@/base/confirm/confirm";
import Suggest from "@/components/suggest/suggest";
import Scroll from "@/base/scroll/scroll";
import { getHotSearch } from "@/service/getData.js";
import { mapActions } from "vuex";
import { setTimeout } from "timers";
import { playlistMixin,searchMixin } from "@/assets/js/mixin.js";
export default {
  mixins: [playlistMixin,searchMixin],
  created() {
    this._getHotSearch();
  },
  data() {
    return {
      hotKey: [],
      reqId: "3c256dc0-ade6-11e9-8d18-1dc2924f4baf"
      // query: ""
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    },
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.shortcutWapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh()
    },
    // addQuery(query) {
    //   // console.log(query)
    //   // this.query=query
    //   this.$refs.SearchBox.setQuery(query);
    // },
    // oneQueryChange(query) {
    //   this.query = query;
    // },
    // blurInput() {
    //   this.$refs.SearchBox.blur();
    // },
    // saveSearch() {
    //   this.saveSearchHistory(this.query);
    // },
    showConfirm() {
      this.$refs.confirm.show();
    },
    _getHotSearch() {
       let data = {
        key:this.query||'',
        reqId: this.reqId
      };
      getHotSearch(data).then(res => {
        if (res.data.code === 200) {
          this.hotKey = res.data.data;
          this.reqId=res.data.reqId
        }
        // console.log(res)
      });
    },
    ...mapActions([
      // "saveSearchHistory",
      // "deleteSearchHistory",
      "clearSearchHistory"
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style lang="scss" scope>
@import "@/assets/css/variable.scss";
//   @import "~common/stylus/variable"
@import "@/assets/css/mixin.scss";
//   @import "~common/stylus/mixin"

.search {
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
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
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
