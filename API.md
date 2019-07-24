# 酷我音乐API

>服务器地址：http://www.kuwo.cn

>都有可选参数：erqId  类型为：'string' 

## banner

* 接口地址

    /api/www/banner/index/bannerList

* 参数

* 调用例子

    /api/www/banner/index/bannerList?reqId=b94ae990-a3c5-11e9-94a9-6f41d3eb5db3

   
## 推荐歌单(每日推荐)

* 接口地址

    /api/www/rcm/index/playlist

* 参数

    loginUid=0

* 调用例子

    /api/www/rcm/index/playlist?loginUid=0&reqId=b94b10a0-a3c5-11e9-94a9-6f41d3eb5db3

## 推荐歌单其他项标签(翻唱,网络,伤感,欧美)

* 接口地址

    /api/www/playlist/index/tags

* 参数

* 调用例子

    /api/www/playlist/index/tags?reqId=6573c9d1-a3c6-11e9-94a9-6f41d3eb5db3
 
## 推荐歌单其他项列表

* 接口地址

    /api/pc/classify/playlist/getTagPlayList

* 参数

    id=1848 推荐项的id  
    pn=1  
    rn=5

* 调用例子

    /api/pc/classify/playlist/getTagPlayList?id=1848&pn=1&rn=5&reqId=19b4eb50-a3c6-11e9-94a9-6f41d3eb5db3

## 推荐歌单列表详情

* 接口地址

    /api/www/playlist/playListInfo

* 参数

    pid=2813797704 推荐项列表的id  
    pn=1  
    rn=30  

* 调用例子

   /api/www/playlist/playListInfo?pid=2813797704&pn=1&rn=30&reqId=b0aeb760-a90d-11e9-ab0a-f511ed1676be

## 歌手推荐标签

* 接口地址

    /api/www/artist/index/tags

* 参数

* 调用例子

   /api/www/artist/index/tags?reqId=2092fa41-a928-11e9-9a0e-530084068a00

## 歌手推荐列表

* 接口地址

    /api/www/artist/artistInfo

* 参数

    category=11 推荐标签的id(热门,全部 0)  
    pn=1  
    rn=6

* 调用例子

   /api/www/artist/artistInfo?category=11&pn=1&rn=6&reqId=2107b510-a928-11e9-9a0e-530084068a00

## 歌手信息

* 接口地址

    /api/www/artist/artist

* 参数

    artistid=5371 歌手id

* 调用例子

   /api/www/artist/artist?artistid=5371&reqId=684d4b00-a929-11e9-9a0e-530084068a00

## 歌手单曲列表

* 接口地址

    /api/www/artist/artistMusic

* 参数

    artistid=5371 歌手id  
    pn=1  
    rn=30

* 调用例子

   /api/www/artist/artistMusic?artistid=5371&pn=1&rn=30&reqId=68645570-a929-11e9-9a0e-530084068a00

## 歌手专辑列表

* 接口地址

    /api/www/artist/artistAlbum

* 参数

    artistid=5371 歌手id  
    pn=1  
    rn=28

* 调用例子

   /api/www/artist/artistAlbum?artistid=5371&pn=1&rn=28&reqId=7a7c0720-a92a-11e9-9a0e-530084068a00

## 歌手专辑详情

* 接口地址

    /api/www/album/albumInfo

* 参数

    albumId=9719184 专辑id  
    pn=1  
    rn=30

* 调用例子

   /api/www/album/albumInfo?albumId=9719184&pn=1&rn=30&reqId=ac3ed3f0-a92a-11e9-9a0e-530084068a00

## 歌手MV列表

* 接口地址

    /api/www/artist/artistMv

* 参数

    artistid=5371 歌手id  
    pn=1  
    rn=28

* 调用例子

   /api/www/artist/artistMv?artistid=5371&pn=1&rn=28&reqId=867c2230-a92f-11e9-9a0e-530084068a00

## 评论

* 接口地址

    /comment

* 参数

    type=get_rec_comment  (最新评论：get_comment，热门评论：get_rec_comment)
    f=web  
    page=1  
    rows=20  
    digest=13  
    sid=7330528 (专辑id，歌单id，MV id)  
    uid=0  
    prod=newWeb  

* 调用例子

   /comment?type=get_rec_comment&f=web&page=1&rows=20&digest=13&sid=7330528&uid=0&prod=newWeb&reqId=b3822710-a92b-11e9-9a0e-530084068a00

## 热搜

* 接口地址

    /api/www/search/searchKey

* 参数

    key= (不传值 获取的是热搜的结果)  
    pn=1 (热搜不传)  
    rn=30 (热搜不传)

* 调用例子

   /api/www/search/searchKey?key=&reqId=3c256dc0-ade6-11e9-8d18-1dc2924f4baf

## 搜索

* 接口地址

    /api/www/search/searchMusicBykeyWord

* 参数

    key=关键字   
    pn=1   
    rn=30 

* 调用例子

    /api/www/search/searchMusicBykeyWord?key=%E6%B0%B4%E6%89%8B&pn=89&rn=30&reqId=d27a1da0-adf2-11e9-af26-5d25fa2f5411

## 榜单分类及列表

* 接口地址

    /api/www/bang/bang/bangMenu

* 参数

* 调用例子

   /api/www/bang/bang/bangMenu?reqId=2694fe20-ade7-11e9-af26-5d25fa2f5411

## 榜单详情

* 接口地址

    /api/www/bang/bang/musicList

* 参数

    bangId=93  
    pn=1  
    rn=30  

* 调用例子

   /api/www/bang/bang/musicList?bangId=93&pn=1&rn=30&reqId=579d3940-ae02-11e9-af26-5d25fa2f5411



推荐歌手(华语):http://www.kuwo.cn/api/www/radio/index/radioList?reqId=6573f0e0-a3c6-11e9-94a9-6f41d3eb5db3

排行榜:http://www.kuwo.cn/api/www/bang/index/bangList?reqId=6573c9d4-a3c6-11e9-94a9-6f41d3eb5db3
主播电台:http://www.kuwo.cn/api/www/radio/index/radioList?reqId=6573f0e0-a3c6-11e9-94a9-6f41d3eb5db3