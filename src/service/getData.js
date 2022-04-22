import axios from "@/axios.js";
//获取推荐页banner
export const getRecommend = (data) => axios.get('/banner',{params: {...data}})

//获取推荐歌单
export const getDiscList = (data) => axios.get('/personalized',{params: {...data}})
//获取推荐详情
export const getSongList=(data)=>axios.get('/playlist/track/all',{params:{...data}})
//获取歌手列表
export const getSingerList = (data) => axios.get('/top/artists',{params:{...data}})
//获取排行榜
export const getTopList = (data) => axios.get('/api/www/bang/bang/bangMenu',{params:{...data}})
//获取歌手单曲
export const _setSinger = (data) => axios.get('/artist/top/song', {params:{...data}})
//获取歌曲url
export const getMusic = (data) => axios.get('/url', {params: {...data}})
//获取歌词
export const getLyric = (data) => axios.get('/lyric', {params: {...data}})
//获取排行榜详情
export const getMusicList=(data)=>axios.get('/api/www/bang/bang/musicList',{params:{...data}})
//获取热搜
export const getHotSearch=(data)=>axios.get('/api/www/search/searchKey', {params:{...data}})

//搜索
export const search=(data)=>axios.get('/api/www/search/searchMusicBykeyWord',{params:{...data}})
//获取歌曲详情
export const getSong = (data) => axios.get('/api/www/music/musicInfo',{params:{...data}})
//获取热门电台
export const getRadioList = (data) => axios.get('/dj/hot',{params:{...data}})

