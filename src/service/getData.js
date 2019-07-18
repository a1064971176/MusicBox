import axios from "@/axios.js";
//获取推荐页banner
export const getRecommend = (data) => axios.get('/api/www/banner/index/bannerList',{params: {...data}})

//获取每日推荐
export const getDiscList = (data) => axios.get('/api/www/rcm/index/playlist',{params: {...data}})
//获取推荐详情
export const getSongList=(data)=>axios.get('/api/www/playlist/playListInfo',{params:{...data}})
//获取歌手列表
export const getSingerList = (data) => axios.get('/api/www/artist/artistInfo',{params:{...data}})

//获取排行榜
export const getTopList = () => axios.get('/toplist/detail')
//获取歌手单曲
export const _setSinger = (id) => axios.get('/artists', {params: {id}})
//获取歌曲url
// export const getMusic = (id) => axios.get('/song/url', {params: {id}})
//获取歌词
export const getLyric = (id) => axios.get('/lyric', {params: {id}})
//获取排行榜详情
export const getMusicList=(idx)=>axios.get('/top/list',{params:{idx}})
//获取热搜
export const getHotSearch=()=>axios.get('/search/hot')

//搜索
export const search=(item)=>axios.get('/search',{params:{...item}})
//获取歌曲详情
export const getSong = (ids) => axios.get('/song/detail',{params:{ids}})

