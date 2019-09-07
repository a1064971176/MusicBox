<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" :reqId="reqId" :showMore="showMore" @scroll="scroll"></music-list>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {_setSinger} from '@/service/getData'
import MusicList from '@/components/music-list/music-list'
export default {
    data() {
        return {
            songs:[],
            limit: 30,
            page: 1,
            pullup: true,
            showMore: true,
            reqId:'7f15b5e0-a95e-11e9-8b1a-490cc445c4c3'
        }
    },
    computed:{
        title(){
            return this.$store.state.singer.name
        },
        bgImage(){
            return this.$store.state.singer.pic300
        },
        ...mapGetters({
            // singer
        })
    },
    created(){
        this.setSinger(this.$store.state.singer)
    },
    methods:{
        //获取歌手单曲
        setSinger(singer){
            if(!singer.id){
                this.$router.push('/singer')
                return
            }
            let data={
                artistid:singer.id,
                pn:this.page,
                rn:this.limit,
                reqId:this.reqId
            }
             _setSinger(data).then(res=>{
                if (res.data.code === 200) {
                    this.songs.push(...res.data.data.list);
                    if (res.data.data.total > this.limit*this.page) {
                        this.page++;
                    } else {
                        this.showMore = false;
                    }
                }
            })
        },
        //加载更多
        scroll(){
            if(this.showMore){
                this.setSinger(this.$store.state.singer)
            }
        }
       
    },
    components:{
        MusicList
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variable.scss';
// .singer-detail{
//     position: fixed;
//     z-index: 100;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: $color-background
// }
 .slide-enter-active, .slide-leave-active{
    transition: all 0.3s}

  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)}
</style>

