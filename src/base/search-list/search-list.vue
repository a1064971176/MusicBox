<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li class="search-item" @click="selectItem(item)" v-for="(item, index) in searches" :key="index">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods:{
      selectItem(item){
          this.$emit("select",item)
      },
      deleteOne(item){
          this.$emit("delete",item)
      }
  }
};
</script>

<style scoped lang="scss" scope>
@import "@/assets/css/variable.scss";
@import "@/assets/css/mixin.scss";

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    &.list-enter-active,
    &.list-leave-active {
      transition: all 0.1s;
    }
    &.list-enter,
    &.list-leave-to {
      height: 0;
    }
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
