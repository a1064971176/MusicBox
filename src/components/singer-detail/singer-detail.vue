<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {_setSinger} from '@/service/getData'
import MusicList from '@/components/music-list/music-list'
export default {
    data() {
        return {
            songs:[]
        }
    },
    computed:{
        title(){
            return this.$store.state.singer.name
        },
        bgImage(){
            return this.$store.state.singer.img1v1Url
        },
        ...mapGetters({
            // singer
        })
    },
    created(){
        this.setSinger(this.$store.state.singer)
    },
    methods:{
        setSinger(singer){
            if(!singer.id){
                 this.$router.push('/singer')
          return
            }
             _setSinger(singer.id).then(res=>{
            this.songs=res.data.hotSongs
                //  console.log(this.songs)

        })
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

