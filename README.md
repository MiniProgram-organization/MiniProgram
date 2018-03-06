# MiniProgram

## 目前完成的功能：

#### 1.注册界面

#### 2.完整的鉴权和保持session机制

后来发现，加密只是为了业务服务器和客户端之间通信的安全，为了简便起见，对目前来说没有必要，现在可以把**rawData**（包括用户昵称，用户身份等信息）直接发到服务器上面去， 由青鸟翰直接存入数据库，然后返回给客户端**openid**（作为和服务器交换数据的用户标识），之后每个用户请求的时候带上openid即可。和服务器数据交换细节见[交接](#index)。 

#### 3.将多个标注点画到地图上

目前使用的是腾讯小程序提供的地图，后续如果功能丰富可能会用到百度地图的api，和服务器数据交换的细节见[交接](#index)

#### 4.天气的API使用的是和风天气API，官网地址为：[https://www.heweather.com](https://www.heweather.com)

## 奖励机制：

#### a. 查天气，每查一次  +1 coin, 相隔2小时以上再次查天气可以累积奖励，每天上限2 coin

#### b. 心情记录， 每天每记录一条 + 1 coin， 相隔2小时以上的心情记录可以累计奖励，每天上限+2 coin

#### c. 签到记录，每天每记录一条 check-in + 1 coin，相隔2小时以上的check-in可以累计奖励，每天上限+5coin

#### d. 连续使用额外奖励：
 1. 连续7天查天气，额外奖励20 coin；连续28天查天气，额外奖励100 coin
 2. 连续7天签到， 额外奖励20  coin；连续28天签到，额外奖励100 coin
 3. 连续7天记录心情， 额外奖励20  coin；连续28天记录心情，额外奖励100 coin
 4. 以上均为(连续天数%7 == 0 && 连续天数%28 != 0)时额外奖励20 coin；(连续天数%28 == 0)时，额外奖励100 coin
 
#### e. 备注：1)  10 coin = ￥1   2) “一天” = 一个自然日，从第一条活动记录timestamp开始


## 交接

#### **注意**

数据的交互全部采用json格式，数据类型严格按照json所示定义，即：

- 共有`Object, Array, string, int, double, string`这六种类型。
- 大括号`{}`表示一个Object，也就是由`key:value`组成的字典，`value`可以为六种类型中的任意一种。
- 中括号`[]`表示一个Array，数组中的元素可以为六种类型中的任意一种。
- 带引号的为string，不带引号分为以下三种:

    - true 或 false，为boolean。
    - 不为true和false，有小数点，为double。
    - 不为true和false，无小数点，为int。

- 根节点类型只能为Object或Array。

接收的数据的根节点类型实际上只可能为Object，因为一定会有一个名为`status`的`key`，其`value`为`"OK"`或者`"ERROR"`(注意全部大写)，表示本次请求是否完成。
若`status`为`"ERROR"`，则同时会有一个名为`message`的`key`，表示出错的信息，若`status`为`"OK"`，则没有`message`。

#### 1.登录，发送用户信息，换取openid

##### 说明：
由于目前取消了注册功能，所以改为在登录时自动注册。所以前端需要在登录时发送rawData给服务器。  
另外，由于后台需要记录登录时的用户位置，所以前端需要发送location信息给服务器。

##### 相关函数：`getOpenId()`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Login](https://40525433.fudan-mini-program.com/cgi-bin/Login)

##### method: POST

##### 发送数据格式： 

```json
{
  "code": "013VSxwK1xExW70pcryK10EJwK1VSxw6",
  "rawData":{
    "nickName":"abc",
    "gender":2,
    "language":"en",
    "city":"Shaoxing",
    "province":"Zhejiang",
    "country":"China",
    "avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ5gUpejVfCsfOw4cLH7g4XhpYIVMeK5PCGlJibEVjicicicgMJwtdnkjZmXCQk4XhRRjJibQvXdiaa2l7A/0"
  },
  "latitude": 10.3434,
  "longitude": 33.3435
}
```

##### 接收数据格式：

```json
{
  status: "OK"
  registered: true,
  openid: "asdfasf"
}
```


#### 2.用户注册

##### 相关函数：`register`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Register](https://40525433.fudan-mini-program.com/cgi-bin/Register)

##### method: POST

##### 发送数据格式：

```json
{
  openid: "asdfasdfsad",
  rawData: "{\"nickName\":\"hazelnut\",
            \"gender\":1,
            \"language\":\"zh_CN\",
            \"city\":\"Chongqing\",
            \"province\":\"Chongqing\",
            \"country\":\"China\",
            \"avatarUrl\":\"https://wx.qlogo.cn\"
            }",
  Tel: "15202345235", //取消
}
```

##### 接收数据格式:

```json
{
  status: "OK"
}
```


#### 3.发送当前地址，换取附近POI信息（deprecated，前端利用api完成）

##### 相关函数：`queryProximity()`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Search](https://40525433.fudan-mini-program.com/cgi-bin/Search)

##### method: POST

##### 发送数据格式： 

```json
{
  openid: "asdfasfsfas",
  latitude: 10.3434,
  longitude: 33.3435
}
```

##### 接收数据格式：

```json
{
  status:"OK"
  coordinates:[
    {
        "POI_id":"1",
        "category":"school",
        "venue":"Fudan University",
        "longitude": 123.324,
        "latitude": 50
    },
    {
        "POI_id":"2",
        "category":"residence",
        "venue":"lsh's dormitory",
        "longitude": 123.43535,
        "latitude": 50.334
    }......
  ]
}
```


#### 4.签到

##### 说明：
1. 由于现在获取附近poi改为由前端获取，服务器没有相应的poi信息，所以签到时需要将poi信息发给后端，包括`POI_id`, `category`, `venue`, `poi_lat`, `poi_lng`, `city`, `country`这几项。
2. 现在用户签到数据会存入本地缓存，但是存在的问题是，当后端返回签到失败时，前端仍然将签到数据存入缓存，而服务器确实没有签到成功，数据库里没有签到信息。

##### 相关函数：`checkPosition()`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/CheckIn](https://40525433.fudan-mini-program.com/cgi-bin/CheckIn)

##### method: POST

##### 发送数据格式： 

```json
{
  POI_id: "1",
  POI_info: {
    category:"school",
    venue: "Fudan University",
    latitude: 12.3, //poi所在纬度
    longitude: 55.4, //poi所在经度
    province: "上海市",
    city: "上海市",
    district: "黄浦区"
  },
  created_by_user: false,
  openid: "haasdfasf",
  latitude: 10.43535, //用户所在纬度
  longitude: 54.454,  //用户所在经度
  text: "老板最帅！！！"
}
```

##### 接收数据格式：

```json
{
    "status": "OK",
    "date": "2017-11-21",
    "time": "19:31:59",
    "award": 21,  //本次签到所获得的奖励分数,20+1
    "scores": 27, //加上本次奖励后，用户的总得分。7(每天签到一次，共7天)+20(连续签到7天奖励，第1次)
    "duration": 7,  //用户连续签到的天数
    "bonus_7": 20,  //当duration%7==0时，bonus_7为连续7天签到的奖励分数，否则为0
    "bonus_28": 0   //当duration%28==0时，bonus_28为连续28天签到的奖励分数，否则为0
}
```


#### 5.天气查询

##### 相关函数：`sgz`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Weather](https://40525433.fudan-mini-program.com/cgi-bin/Weather)

##### method: POST

##### 发送数据格式： 

```json
{
  openid: "agdsg1sdg",
  latitude: 10.43535,
  longitude: 54.454,
  location: "北京" //该参数用于查询其他城市天气，如果没有此参数则按经纬度查询。
}
```

##### 接收数据格式：

```json
{
    "status": "OK",
    "now": {
        "cloud": "0",
        "cond_code": "101",
        "cond_txt": "多云",
        "fl": "16",
        "hum": "73",
        "pcpn": "0",
        "pres": "1024",
        "tmp": "14",
        "vis": "7",
        "wind_deg": "83",
        "wind_dir": "东风",
        "wind_sc": "微风",
        "wind_spd": "7"
    },
    "lifestyle":[
        {
                    "brf": "舒适",
                    "txt": "今天夜间不太热也不太冷，风力不大，相信您在这样的天气条件下，应会感到比较清爽和舒适。",
                    "type": "comf"  //只需要type为comf的，也就是官方api列表中的第一个。
        }
    ],
    "forecast": [
        {
            "cond_code_d": "103",
            "cond_code_n": "100",
            "cond_txt_d": "晴间多云",
            "cond_txt_n": "晴",
            "date": "2017-10-31",
            "hum": "59",
            "pcpn": "0.0",
            "pop": "0",
            "pres": "1025",
            "tmp_max": "18",
            "tmp_min": "10",
            "uv_index": "5",
            "vis": "16",
            "wind_deg": "166",
            "wind_dir": "东南风",
            "wind_sc": "微风",
            "wind_spd": "6"
        },
        {
            "cond_code_d": "101",
            "cond_code_n": "101",
            "cond_txt_d": "多云",
            "cond_txt_n": "多云",
            "date": "2017-11-01",
            "hum": "61",
            "pcpn": "0.0",
            "pop": "0",
            "pres": "1021",
            "tmp_max": "22",
            "tmp_min": "11",
            "uv_index": "5",
            "vis": "20",
            "wind_deg": "114",
            "wind_dir": "东南风",
            "wind_sc": "微风",
            "wind_spd": "7"
        },
        {
            "cond_code_d": "101",
            "cond_code_n": "101",
            "cond_txt_d": "多云",
            "cond_txt_n": "多云",
            "date": "2017-11-02",
            "hum": "68",
            "pcpn": "0.0",
            "pop": "2",
            "pres": "1019",
            "tmp_max": "22",
            "tmp_min": "12",
            "uv_index": "5",
            "vis": "20",
            "wind_deg": "296",
            "wind_dir": "西北风",
            "wind_sc": "微风",
            "wind_spd": "3"
        }
    ],
    "air": {
                "aqi": "19",
                "co": "0",
                "main": "",
                "no2": "34",
                "o3": "31",
                "pm10": "18",
                "pm25": "8",
                "pub_time": "2017-11-07 22:00",
                "qlty": "优",
                "so2": "2"
            },
    "basic": {
        "cid": "CN101020600",
        "location": "浦东新区",
        "parent_city": "上海",
        "admin_area": "上海",
        "cnty": "中国",
        "lat": "31.24594307",
        "lon": "121.56770325",
        "tz": "+8.0"
    },
    "award": {
        "award": 101,  //本次查天气所获得的奖励分数
        "scores": 188, //加上本次奖励后，用户的总得分。28*1(每天查天气一次，共28天)+20*3(每连续7天奖励一次，共3次)+100(连续查天气28天奖励，第一次)
        "duration": 28,  //用户连续查天气的天数
        "bonus_7": 0,  //当duration%7==0时，bonus_7为连续7天查天气的奖励分数，否则为0
        "bonus_28": 100   //当duration%28==0时，bonus_28为连续28天查天气的奖励分数，否则为0
    }
}
```



#### 6.历史签到记录

##### 说明：
现在获取历史签到记录改为由前端直接从本地缓存获取，但是为了防止缓存丢失，向服务器获取签到记录这一功能仍然应该保留。
前端可以通过以下几种方式来防止缓存丢失、被修改、与服务器数据库不一致的情况：
1. 如果能获得用户的设备号，当用户更换设备时应向服务器获取历史记录。
2. 设定一个固定的时间点向服务器获取记录，如每天第一次登录时。

##### 相关函数：`sgz`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/History](https://40525433.fudan-mini-program.com/cgi-bin/History)

##### method: POST

##### 发送数据格式： 

```json
{
  openid: "agdsg1sdg"
}
```

##### 接收数据格式：

```json
{
    "status": "OK",
    "checkin_num": 3,
    "checkins": [
        { 
          "POI_id": "1124235",
          "venue": "Fudan University",
          "datetime": "2017-07-01 08:08:08",
          "category": "school",
          "latitude": 23.123,
          "longitude": 123.123,
          "text":"男神最帅！"
        },
        {
          "POI_id": "23242",
          "venue": "Peking University",
          "datetime": "2017-07-02 08:08:08",
          "category": "school",
          "latitude": 43.123,
          "longitude": 123.123,
          "text":"秦歌棒棒哒！"
        },
        {
          "POI_id": "3432423",
          "venue": "Peking University",
          "datetime": "2017-08-16 10:10:10",
          "category": "school",
          "latitude": 43.123,
          "longitude": 123.123,
          "text":"皮卡丘萌萌哒！！"
        }
      ]
}
```


#### 7.获取二维码

##### 说明：
目前获取二维码的方式是采用[微信小程序官方文档的接口B](https://mp.weixin.qq.com/debug/wxadoc/dev/api/qrcode.html)。
前端获取二维码分成以下两步：
1. 前端发送POST请求给服务器，POST的参数按照官方文档接口B的描述填写，服务器向微信获取二维码，并把二维码图片保存在服务器上，然后向前端返回图片的url。
2. 前端用GET的方式即可向服务器获取二维码图片。

##### 相关函数：`sgz`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/QRCode](https://40525433.fudan-mini-program.com/cgi-bin/QRCode)

##### method: POST

##### 发送数据格式： 

```json
{
  scene: "lsh",
  path: "pages/index/index",
  width: 430,
  auto_color: false,
  line_color: {
    "r":"0",
    "g":"255",
    "b":"0"
  }
}
```

##### 接收数据格式：

```json
{
  status: "OK",
  url: "https://40525433.fudan-mini-program.com/Files/QRCode1507377585.jpeg"
}
```


#### 8.查看POI签到情况

##### 相关函数：`sgz`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Recent](https://40525433.fudan-mini-program.com/cgi-bin/Recent)

##### method: POST

##### 发送数据格式： 

```json
{
  POI_id: "1234",
  user_num: 10 //查看最近在这里签到的用户数
}
```

##### 接收数据格式：

```json
{
   "status": "OK",
   "user_num": 3, //不一定与请求的user_num相等
   "users": [
      {
        "openid":"1234",
        "nickName":"lsh",
        "avatarUrl":"https://wx.qlogo.cn/abcd",
        "datetime":"2017-07-01 08:08:08",
        "text":"老板最帅！！！"
      },  
      {
        "openid":"12345",
        "nickName":"sgz",
        "avatarUrl":"https://wx.qlogo.cn/abcde",
        "datetime":"2017-06-01 08:08:08",
        "text":"老板最帅！！！"
      },
      {
        "openid":"123",
        "nickName":"gongdao",
        "avatarUrl":"https://wx.qlogo.cn/abc",
        "datetime":"2017-05-01 08:08:08",
        "text":"老板最帅！！！"
      }
   ]
}
```


#### 9.记录心情

##### url:[https://40525433.fudan-mini-program.com/cgi-bin/Mood](https://40525433.fudan-mini-program.com/cgi-bin/Mood)

##### method: POST

##### 发送数据格式：

```json
{ 
  "mood_id":1,           //心情类型(1-7)
  "mood_text":"狂喜",    //心情类型对应的文字
  "openid":"hafsdfs",
  "text":"心情文字",
  "latitude":10.43535,   //用户所在纬度
  "longitude":54.454     //用户所在经度
}
```

##### 接收数据格式：

```json
{
    "status": "OK",
    "date": "2017-11-21",
    "time": "19:31:59",
    "award": 1,  //本次记录心情所获得的奖励分数
    "scores": 3, //加上本次奖励后，用户的总得分
    "duration": 2,  //用户连续记录心情的天数
    "bonus_7": 0,  //当duration%7==0时，bonus_7为连续7天记录心情的奖励分数，否则为0
    "bonus_28": 0   //当duration%28==0时，bonus_28为连续28天记录心情的奖励分数，否则为0
}
```


#### 10.查看用户历史签到的行政区分布情况

##### url:[https://40525433.fudan-mini-program.com/cgi-bin/Area](https://40525433.fudan-mini-program.com/cgi-bin/Area)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"hafsdfs",
  "area_type":1
  //1:district, 2:city
}
```

##### 接收数据格式：
```json
{
   "status": "OK",
   "area_num": 3, //这个用户在三个行政区签过到
   "areas": [
      {
        "area_name":"上海-黄浦区",
        "check_num":15
      },  
      {
        "area_name":"漳州-龙文区",
        "check_num":4
      },
      {
        "area_name":"上海-徐汇区",
        "check_num":25
      }
   ]
}

{
   "status": "OK",
   "area_num": 2, //这个用户在三个行政区签过到
   "areas": [
      {
        "area_name":"上海"
        "check_num":40
      },  
      {
        "area_name":"漳州"
        "check_num":4
      }
   ]
}
```


#### 11.查看用户在所有历史签到的类别分布情况

##### url:[https://40525433.fudan-mini-program.com/cgi-bin/Category](https://40525433.fudan-mini-program.com/cgi-bin/Category)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"hafsdfs"
}
```

##### 接收数据格式：
```json
{
   "status": "OK",
   "category_num": 3, //这个用户三个类别签过到
   "categories": [
      {
        "category_name":"机构团体",
        "check_num":15
      },  
      {
        "category_name":"旅游景点",
        "check_num":4
      },
      {
        "category_name":"教育学校",
        "check_num":25
      }
   ]
}
```


#### 12.历史心情记录

##### url:[https://40525433.fudan-mini-program.com/cgi-bin/MoodHistory](https://40525433.fudan-mini-program.com/cgi-bin/MoodHistory)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"hafsdfs"
}
```

##### 接收数据格式：
```json
{
    "status": "OK",
    "mood_num": 2,
    "moods": [
        { 
          "mood_id": 1,
          "mood_text":"狂喜",
          "datetime": "2017-07-01 08:08:08",
          "text":"心情文字",
          "latitude": 23.123,
          "longitude": 123.123
        },
        {
          "mood_id": 1,
          "mood_text":"狂喜",
          "datetime": "2016-07-01 08:08:08",
          "text":"心情文字",
          "latitude": 23.123,
          "longitude": 123.123
        }
      ]
}
```

#### 13.获取指定时间段历史心情记录的类别分布情况

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/MoodCategory](https://40525433.fudan-mini-program.com/cgi-bin/MoodCategory)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"hafsdfs",
  "time_type":1,       //时间段 
  //1:今天,2:本周,3:本月,4:今年,5:全部
}
```

##### 接收数据格式：
```json
{
   "status": "OK",
   "mood_id_num": 3, //这个用户在三个类别的心情签过到
   "moods": [
      {
        "mood_id":1,
        "check_num":25,
      },  
      {
        "mood_id":2,
        "check_num":35,
      },
      {
        "mood_id":7,
        "check_num":5,
      }
   ]
}
```


#### 14.用户为我们提供意见

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Feedback](https://40525433.fudan-mini-program.com/cgi-bin/Feedback)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"hafsdfs",
  "opinion_text":"你们的东西做的太好了！",    
}
```

##### 接收数据格式：
```json
{
   "status": "OK"
}
```


#### 15.查询用户签到数量最多的n个Place

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/FrequentPOIs](https://40525433.fudan-mini-program.com/cgi-bin/FrequentPOIs)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"hafsdfs",
  "place_num":5
}
```

##### 接收数据格式：
```json
{
   "status": "OK",
   "place_num": 3,  //查询到的n个place,如果签到的不同place小于n,则返回不同的place数目；如果因为并列使得存在多于n个place，则返回全部并列的place。
   "places": [      //按签到次数排序
      {
        "POI_id":"fsfs1",
        "venue":"复旦大学张江校区",
        "check_num":25,
      },  
      {
        "POI_id":"fsfs2",
        "venue":"计算机楼",
        "check_num":20,
      }, 
      {
        "POI_id":"fsfsd3",
        "venue":"保障楼",
        "check_num":10,
      }
   ]
}
```

#### 16.查询在某poi签到次数最多的一个用户

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/FrequentUsers](https://40525433.fudan-mini-program.com/cgi-bin/FrequentUsers)

##### method: POST

##### 发送数据格式：

```json
{ 
  "POI_id":"9211009583842527247",
  "user_num":1
}
```

##### 接收数据格式：
```json
{
   "status": "OK",
   "user_num":1, //如果两个用户签到次数相同，则返回“上一次签到时间”(即datetime域)早的用户。
   "users":[
      {
        "openid":"1234",
        "nickName":"lsh",
        "avatarUrl":"https://wx.qlogo.cn/abcd",
        "datetime":"2017-07-01 08:08:08",   //这个签到最多的用户，上一次签到的时间。
        "check_num":109                   //该用户在这个POI签到的次数。
      }
  ]
}
```


#### 16.获取天气城市列表

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/City](https://40525433.fudan-mini-program.com/cgi-bin/City)

##### method: POST

##### 发送数据格式：

```json
{ 
  "level":2,  //查询的级别，当level=1时，无需query值，接口返回所有1级城市。当level=2时，query指定一个1级城市，接口返回该城市的所有二级辖域。
  "query":"上海", //当level=1时，无需该参数。
  "in_china":1  //国内or国外，1=国内,0=国外
}
```

##### 接收数据格式：
```json
{
    "status": "OK",
    "city_num": 11,
    "cities": [
        "上海",
        "嘉定",
        "奉贤",
        "宝山",
        "崇明",
        "徐汇",
        "松江",
        "浦东新区",
        "金山",
        "闵行",
        "青浦"
    ]
}
```


#### 17.查询积分，连续活跃天数

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Scores](https://40525433.fudan-mini-program.com/cgi-bin/Scores)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"xfvsdgf", 
}
```

##### 接收数据格式：
```json
{
    "status": "OK",
    "scores": 100,
    "duration_checkin": 11,
    "duration_weather": 12,
    "duration_mood":0,
}
```



#### 18.查询国家

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/GetNation](https://40525433.fudan-mini-program.com/cgi-bin/GetNation)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"xfvsdgf", 
  "latitude":31,
  "longitude":121
}
```

##### 接收数据格式：
```json
{
    "status": "OK",
    "nation":"中国"
}
```




#### 19.查询世界天气

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Weather_World](https://40525433.fudan-mini-program.com/cgi-bin/Weathre_World)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"xfvsdgf", 
  "latitude":31,
  "longitude":121
}
```

##### 接收数据格式：
```json
{
    "status": "OK",
    "weatherWorld": {
        "channel": {
            "ttl": "60",
            "item": {
                "lat": "36.00388",
                "guid": {
                    "isPermaLink": "false"
                },
                "link": "http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-56574606/",
                "long": "-78.938477",
                "title": "Conditions for Durham, NC, US at 08:00 PM EST",
                "pubDate": "Tue, 30 Jan 2018 08:00 PM EST",
                "forecast": [
                    {
                        "day": "Tue",
                        "low": "-2",
                        "code": 405,
                        "date": "30 Jan 2018",
                        "high": "3",
                        "text": "Rain And Snow"
                    },
                    {
                        "day": "Wed",
                        "low": "-6",
                        "code": 100,
                        "date": "31 Jan 2018",
                        "high": "8",
                        "text": "Sunny"
                    },
                    {
                        "day": "Thu",
                        "low": "0",
                        "code": 104,
                        "date": "01 Feb 2018",
                        "high": "15",
                        "text": "Partly Cloudy"
                    },
                    {
                        "day": "Fri",
                        "low": "-2",
                        "code": 300,
                        "date": "02 Feb 2018",
                        "high": "11",
                        "text": "Rain"
                    },
                    {
                        "day": "Sat",
                        "low": "-7",
                        "code": 104,
                        "date": "03 Feb 2018",
                        "high": "4",
                        "text": "Partly Cloudy"
                    },
                    {
                        "day": "Sun",
                        "low": "0",
                        "code": 405,
                        "date": "04 Feb 2018",
                        "high": "5",
                        "text": "Rain And Snow"
                    },
                    {
                        "day": "Mon",
                        "low": "0",
                        "code": 405,
                        "date": "05 Feb 2018",
                        "high": "7",
                        "text": "Rain And Snow"
                    },
                    {
                        "day": "Tue",
                        "low": "-3",
                        "code": 104,
                        "date": "06 Feb 2018",
                        "high": "10",
                        "text": "Partly Cloudy"
                    },
                    {
                        "day": "Wed",
                        "low": "1",
                        "code": 302,
                        "date": "07 Feb 2018",
                        "high": "12",
                        "text": "Scattered Showers"
                    },
                    {
                        "day": "Thu",
                        "low": "3",
                        "code": 104,
                        "date": "08 Feb 2018",
                        "high": "11",
                        "text": "Partly Cloudy"
                    }
                ],
                "condition": {
                    "code": "31",
                    "date": "Tue, 30 Jan 2018 08:00 PM EST",
                    "temp": "0",
                    "text": "Clear"
                },
                "description": "<![CDATA[<img src=\"http://l.yimg.com/a/i/us/we/52/31.gif\"/>\n<BR />\n<b>Current Conditions:</b>\n<BR />Clear\n<BR />\n<BR />\n<b>Forecast:</b>\n<BR /> Tue - Rain And Snow. High: 3Low: -2\n<BR /> Wed - Sunny. High: 8Low: -6\n<BR /> Thu - Partly Cloudy. High: 15Low: 0\n<BR /> Fri - Rain. High: 11Low: -2\n<BR /> Sat - Partly Cloudy. High: 4Low: -7\n<BR />\n<BR />\n<a href=\"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-56574606/\">Full Forecast at Yahoo! Weather</a>\n<BR />\n<BR />\n<BR />\n]]>"
            },
            "link": "http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-56574606/",
            "wind": {
                "chill": "23",
                "speed": "22.53",
                "direction": "330"
            },
            "image": {
                "url": "http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif",
                "link": "http://weather.yahoo.com",
                "title": "Yahoo! Weather",
                "width": "142",
                "height": "18"
            },
            "title": "Yahoo! Weather - Durham, NC, US",
            "units": {
                "speed": "km/h",
                "distance": "km",
                "pressure": "mb",
                "temperature": "C"
            },
            "language": "en-us",
            "location": {
                "city": "Durham",
                "region": " NC",
                "country": "United States"
            },
            "astronomy": {
                "sunset": "5:41 pm",
                "sunrise": "7:18 am"
            },
            "atmosphere": {
                "rising": "0",
                "humidity": "43",
                "pressure": "34270.27",
                "visibility": "25.91"
            },
            "description": "Yahoo! Weather for Durham, NC, US",
            "lastBuildDate": "Tue, 30 Jan 2018 08:32 PM EST"
        }
    },
    "basic": {
        "country": "United States",
        "city": "Durham"
    },
    "award": {
        "award": 0,
        "scores": 60,
        "duration": 3,
        "bonus_7": 0,
        "bonus_28": 0
    }
}
```


#### 20.查询附近POI

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/SearchPOI](https://40525433.fudan-mini-program.com/cgi-bin/SearchPOI)

##### method: POST

##### 发送数据格式：

```json
{ 
  "openid":"xfvsdgf", 
  "latitude":31,
  "longitude":121
}
```

##### 接收数据格式：
```json
{
    "status":"OK",
    "response": {
        "suggestedFilters": {
            "header": "Tap to show:",
            "filters": [
                {
                    "name": "Open now",
                    "key": "openNow"
                }
            ]
        },
        "suggestedRadius": 1386,
        "headerLocation": "Xúhuì",
        "headerFullLocation": "Xúhuì, Shanghai",
        "headerLocationGranularity": "neighborhood",
        "totalResults": 102,
        "suggestedBounds": {
            "ne": {
                "lat": 31.194866917256874,
                "lng": 121.43861507036306
            },
            "sw": {
                "lat": 31.177204146797294,
                "lng": 121.43209192108608
            }
        },
        "groups": [
            {
                "type": "Recommended Places",
                "name": "recommended",
                "items": [
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "4b3f24dff964a52048a425e3",
                            "name": "宜家家居",
                            "contact": {
                                "phone": "+864008002345",
                                "formattedPhone": "+86 400 800 2345"
                            },
                            "location": {
                                "address": "126 Caoxi Rd | 漕溪路126号",
                                "crossStreet": "Zhongshan (W) Rd",
                                "lat": 31.178007,
                                "lng": 121.434235,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.178007,
                                        "lng": 121.434235
                                    }
                                ],
                                "distance": 598,
                                "postalCode": "200235",
                                "cc": "CN",
                                "neighborhood": "Xúhuì",
                                "city": "Xúhuì",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "126 Caoxi Rd | 漕溪路126号 (Zhongshan (W) Rd), Xúhuì",
                                    "Xúhuì",
                                    "上海市, 200235",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "4bf58dd8d48988d1f8941735",
                                    "name": "Furniture / Home Store",
                                    "pluralName": "Furniture / Home Stores",
                                    "shortName": "Furniture / Home",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/shops/furniture_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 8852,
                                "usersCount": 3628,
                                "tipCount": 86
                            },
                            "url": "http://www.ikea.com/cn/zh/store/shanghai/",
                            "rating": 8,
                            "ratingColor": "73CF42",
                            "ratingSignals": 404,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "hours": {
                                "status": "Open until 11:00 PM",
                                "richStatus": {
                                    "entities": [],
                                    "text": "Open until 11:00 PM"
                                },
                                "isOpen": true,
                                "isLocalHoliday": false
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 1,
                                "summary": "One other person is here",
                                "groups": [
                                    {
                                        "type": "others",
                                        "name": "Other people here",
                                        "count": 1,
                                        "items": []
                                    }
                                ]
                            }
                        },
                        "tips": [
                            {
                                "id": "50a1fb11e4b04e11e7d66a59",
                                "createdAt": 1352792849,
                                "text": "The Xujiahui cafeteria is a surprisingly great cheap brunch option. Try its salmon platter with dill dressing and a lemon wedge, pairing well with the organic mushroom and cheese stuffed crêpes.",
                                "type": "user",
                                "url": "http://www.timeoutshanghai.com/event/Food__Drink-Brunches/8519/Brunch-at-IKEA.html",
                                "canonicalUrl": "https://foursquare.com/item/50a1fb11e4b04e11e7d66a59",
                                "likes": {
                                    "count": 8,
                                    "groups": [],
                                    "summary": "8 likes"
                                },
                                "logView": true,
                                "agreeCount": 9,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 5
                                },
                                "user": {
                                    "id": "17878112",
                                    "firstName": "Time Out Shanghai",
                                    "gender": "none",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/030IWHQQCLRKTPP5.png"
                                    },
                                    "type": "page"
                                }
                            }
                        ],
                        "referralId": "e-0-4b3f24dff964a52048a425e3-0"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "4f2e0915e4b062035743a8d1",
                            "name": "Ippaiya (一杯屋)",
                            "contact": {},
                            "location": {
                                "address": "漕溪北路577号",
                                "lat": 31.189583324638054,
                                "lng": 121.4323884278714,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.189583324638054,
                                        "lng": 121.4323884278714
                                    }
                                ],
                                "distance": 702,
                                "cc": "CN",
                                "city": "上海市",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "漕溪北路577号",
                                    "Xúhuì",
                                    "上海市",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "4bf58dd8d48988d111941735",
                                    "name": "Japanese Restaurant",
                                    "pluralName": "Japanese Restaurants",
                                    "shortName": "Japanese",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/japanese_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 115,
                                "usersCount": 45,
                                "tipCount": 0
                            },
                            "price": {
                                "tier": 2,
                                "message": "Moderate",
                                "currency": "¥"
                            },
                            "rating": 7.7,
                            "ratingColor": "C5DE35",
                            "ratingSignals": 9,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "referralId": "e-0-4f2e0915e4b062035743a8d1-1"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "4b0c8dd2f964a5202f3f23e3",
                            "name": "耶里夏丽新疆餐厅",
                            "contact": {
                                "phone": "+862164686079",
                                "formattedPhone": "+86 21 6468 6079"
                            },
                            "location": {
                                "address": "南丹东路106号",
                                "crossStreet": "天钥桥路",
                                "lat": 31.19196904300924,
                                "lng": 121.43826378340772,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.19196904300924,
                                        "lng": 121.43826378340772
                                    }
                                ],
                                "distance": 1063,
                                "postalCode": "200030",
                                "cc": "CN",
                                "city": "上海市",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "南丹东路106号 (天钥桥路)",
                                    "上海市",
                                    "上海市, 200030",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "52af3b913cf9994f4e043c06",
                                    "name": "Xinjiang Restaurant",
                                    "pluralName": "Xinjiang Restaurants",
                                    "shortName": "Xinjiang",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/asian_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 1004,
                                "usersCount": 487,
                                "tipCount": 21
                            },
                            "url": "http://www.yelixiali.com/browse!shopShow?id=4",
                            "rating": 8.5,
                            "ratingColor": "73CF42",
                            "ratingSignals": 83,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "hours": {
                                "status": "Likely open",
                                "richStatus": {
                                    "entities": [],
                                    "text": "Likely open"
                                },
                                "isOpen": true,
                                "isLocalHoliday": false
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "tips": [
                            {
                                "id": "52182cd911d28a9e60199232",
                                "createdAt": 1377316057,
                                "text": "Food from Xinjiang. A dance recital and entertainment with fantastic spicy racks of lamb",
                                "type": "user",
                                "canonicalUrl": "https://foursquare.com/item/52182cd911d28a9e60199232",
                                "photo": {
                                    "id": "52182cdf11d202c8e60d516a",
                                    "createdAt": 1377316063,
                                    "source": {
                                        "name": "Foursquare for iOS",
                                        "url": "https://foursquare.com/download/#/iphone"
                                    },
                                    "prefix": "https://igx.4sqi.net/img/general/",
                                    "suffix": "/56001512_CzHwWIVTZyB1BGzeh2UsbHeonZl9VrO9B_Uu6ma1PBU.jpg",
                                    "width": 720,
                                    "height": 960,
                                    "visibility": "public"
                                },
                                "photourl": "https://igx.4sqi.net/img/general/original/56001512_CzHwWIVTZyB1BGzeh2UsbHeonZl9VrO9B_Uu6ma1PBU.jpg",
                                "likes": {
                                    "count": 1,
                                    "groups": [],
                                    "summary": "1 like"
                                },
                                "logView": true,
                                "agreeCount": 1,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 0
                                },
                                "user": {
                                    "id": "56001512",
                                    "firstName": "A",
                                    "lastName": "Jay",
                                    "gender": "male",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/RFVBNZ03LMTHGRBQ.jpg"
                                    }
                                }
                            }
                        ],
                        "referralId": "e-0-4b0c8dd2f964a5202f3f23e3-2"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "4c41866dd7fad13a26ac07da",
                            "name": "唐韵秦风",
                            "contact": {},
                            "location": {
                                "address": "星游城四楼",
                                "lat": 31.18704931332998,
                                "lng": 121.43817404731632,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.18704931332998,
                                        "lng": 121.43817404731632
                                    }
                                ],
                                "distance": 608,
                                "cc": "CN",
                                "city": "上海市",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "星游城四楼",
                                    "上海市",
                                    "上海市",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "4bf58dd8d48988d145941735",
                                    "name": "Chinese Restaurant",
                                    "pluralName": "Chinese Restaurants",
                                    "shortName": "Chinese",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/asian_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 139,
                                "usersCount": 89,
                                "tipCount": 5
                            },
                            "price": {
                                "tier": 1,
                                "message": "Cheap",
                                "currency": "¥"
                            },
                            "rating": 7.2,
                            "ratingColor": "C5DE35",
                            "ratingSignals": 9,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "tips": [
                            {
                                "id": "4da3d7c87aee5481794ef2fe",
                                "createdAt": 1302583240,
                                "text": "油泼扯面很好吃～中午12点半人很多",
                                "type": "user",
                                "canonicalUrl": "https://foursquare.com/item/4da3d7c87aee5481794ef2fe",
                                "likes": {
                                    "count": 1,
                                    "groups": [],
                                    "summary": "1 like"
                                },
                                "logView": true,
                                "agreeCount": 0,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 1
                                },
                                "user": {
                                    "id": "3328184",
                                    "firstName": "Yvonne",
                                    "lastName": "P",
                                    "gender": "female",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/DHBRXLH5RR3JINSQ.jpg"
                                    }
                                }
                            }
                        ],
                        "referralId": "e-0-4c41866dd7fad13a26ac07da-3"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "4df7663745dd222116c93b4b",
                            "name": "查餐厅",
                            "contact": {
                                "phone": "+862134615618",
                                "formattedPhone": "+86 21 3461 5618"
                            },
                            "location": {
                                "address": "天钥桥路131号永新坊B1楼18号 | Novel Plaza",
                                "crossStreet": "近辛耕路",
                                "lat": 31.194013389735723,
                                "lng": 121.43794283894864,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.194013389735723,
                                        "lng": 121.43794283894864
                                    }
                                ],
                                "distance": 1261,
                                "postalCode": "200030",
                                "cc": "CN",
                                "neighborhood": "Xújiāhuì",
                                "city": "上海市",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "天钥桥路131号永新坊B1楼18号 | Novel Plaza (近辛耕路), Xújiāhuì",
                                    "上海市",
                                    "上海市, 200030",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "4bf58dd8d48988d145941735",
                                    "name": "Chinese Restaurant",
                                    "pluralName": "Chinese Restaurants",
                                    "shortName": "Chinese",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/asian_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 1822,
                                "usersCount": 664,
                                "tipCount": 23
                            },
                            "url": "http://www.dianping.com/shop/5209815",
                            "price": {
                                "tier": 1,
                                "message": "Cheap",
                                "currency": "¥"
                            },
                            "rating": 8.1,
                            "ratingColor": "73CF42",
                            "ratingSignals": 87,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "hours": {
                                "status": "Likely open",
                                "richStatus": {
                                    "entities": [],
                                    "text": "Likely open"
                                },
                                "isOpen": true,
                                "isLocalHoliday": false
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "tips": [
                            {
                                "id": "4e50b181483bb770492221bc",
                                "createdAt": 1313911169,
                                "text": "联通3G无信号，需进门前check in",
                                "type": "user",
                                "canonicalUrl": "https://foursquare.com/item/4e50b181483bb770492221bc",
                                "likes": {
                                    "count": 4,
                                    "groups": [],
                                    "summary": "4 likes"
                                },
                                "logView": true,
                                "agreeCount": 4,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 0
                                },
                                "user": {
                                    "id": "1169434",
                                    "firstName": "Nicolas",
                                    "lastName": "Zhang",
                                    "gender": "male",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/1YFOLR0SL3AT5AUF.jpg"
                                    }
                                }
                            }
                        ],
                        "referralId": "e-0-4df7663745dd222116c93b4b-4"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "4bf2957a20960f4747656e2f",
                            "name": "Aki's Kitchen",
                            "contact": {
                                "phone": "+862164812005",
                                "formattedPhone": "+86 21 6481 2005"
                            },
                            "location": {
                                "address": "131 Tianyaoqiao Rd | 天钥桥路131号",
                                "crossStreet": "Novel Place | 永新坊",
                                "lat": 31.194064064054167,
                                "lng": 121.43767760403284,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.194064064054167,
                                        "lng": 121.43767760403284
                                    }
                                ],
                                "distance": 1258,
                                "postalCode": "200030",
                                "cc": "CN",
                                "neighborhood": "Xújiāhuì",
                                "city": "上海市",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "131 Tianyaoqiao Rd | 天钥桥路131号 (Novel Place | 永新坊), Xújiāhuì",
                                    "Xúhuì",
                                    "上海市, 200030",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "4bf58dd8d48988d111941735",
                                    "name": "Japanese Restaurant",
                                    "pluralName": "Japanese Restaurants",
                                    "shortName": "Japanese",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/japanese_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 753,
                                "usersCount": 436,
                                "tipCount": 41
                            },
                            "url": "http://www.kotaskitchen.com",
                            "price": {
                                "tier": 2,
                                "message": "Moderate",
                                "currency": "¥"
                            },
                            "rating": 8,
                            "ratingColor": "73CF42",
                            "ratingSignals": 67,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "hours": {
                                "status": "Likely open",
                                "richStatus": {
                                    "entities": [],
                                    "text": "Likely open"
                                },
                                "isOpen": true,
                                "isLocalHoliday": false
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "tips": [
                            {
                                "id": "4bf388c270c603bba3139cb4",
                                "createdAt": 1274251458,
                                "text": "Great shochu selection",
                                "type": "user",
                                "canonicalUrl": "https://foursquare.com/item/4bf388c270c603bba3139cb4",
                                "likes": {
                                    "count": 5,
                                    "groups": [],
                                    "summary": "5 likes"
                                },
                                "logView": true,
                                "agreeCount": 0,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 1
                                },
                                "user": {
                                    "id": "363098",
                                    "firstName": "Vincent",
                                    "lastName": "Tan",
                                    "gender": "male",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/HUNXVZZUBBUG2WSF.jpg"
                                    }
                                }
                            }
                        ],
                        "referralId": "e-0-4bf2957a20960f4747656e2f-5"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "4bd03589b221c9b66f37d3d0",
                            "name": "宜家餐厅",
                            "contact": {
                                "phone": "+864008002345",
                                "formattedPhone": "+86 400 800 2345"
                            },
                            "location": {
                                "address": "2/F 126 Caoxi Rd",
                                "lat": 31.178179,
                                "lng": 121.4347,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.178179,
                                        "lng": 121.4347
                                    }
                                ],
                                "distance": 586,
                                "postalCode": "200235",
                                "cc": "CN",
                                "neighborhood": "Xúhuì",
                                "city": "上海市",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "2/F 126 Caoxi Rd, Xúhuì",
                                    "上海市",
                                    "上海市, 200235",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "4bf58dd8d48988d1c6941735",
                                    "name": "Scandinavian Restaurant",
                                    "pluralName": "Scandinavian Restaurants",
                                    "shortName": "Scandinavian",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/scandinavian_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 1029,
                                "usersCount": 573,
                                "tipCount": 13
                            },
                            "price": {
                                "tier": 2,
                                "message": "Moderate",
                                "currency": "¥"
                            },
                            "rating": 7.1,
                            "ratingColor": "C5DE35",
                            "ratingSignals": 87,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "hours": {
                                "status": "Open until 10:00 PM",
                                "richStatus": {
                                    "entities": [],
                                    "text": "Open until 10:00 PM"
                                },
                                "isOpen": true,
                                "isLocalHoliday": false
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "tips": [
                            {
                                "id": "55a1f22a498e8cd69c94a920",
                                "createdAt": 1436676650,
                                "text": "Feels like coming home! Hem ljuva hem!",
                                "type": "user",
                                "canonicalUrl": "https://foursquare.com/item/55a1f22a498e8cd69c94a920",
                                "likes": {
                                    "count": 2,
                                    "groups": [],
                                    "summary": "2 likes"
                                },
                                "logView": true,
                                "agreeCount": 3,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 0
                                },
                                "user": {
                                    "id": "23961504",
                                    "firstName": "Andreas",
                                    "lastName": "Bränström",
                                    "gender": "male",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/2SGBG02FR0YP21W1.jpg"
                                    }
                                }
                            }
                        ],
                        "referralId": "e-0-4bd03589b221c9b66f37d3d0-6"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "528727d411d2efaec747f344",
                            "name": "Sunday Smile",
                            "contact": {},
                            "location": {
                                "address": "580 Tianyaoqiao Rd | 天钥桥路580号",
                                "crossStreet": "F/1 08-09 In Center Mall",
                                "lat": 31.1871108940767,
                                "lng": 121.43831856357775,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.1871108940767,
                                        "lng": 121.43831856357775
                                    }
                                ],
                                "distance": 623,
                                "cc": "CN",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "580 Tianyaoqiao Rd | 天钥桥路580号 (F/1 08-09 In Center Mall)",
                                    "上海市",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "4bf58dd8d48988d16a941735",
                                    "name": "Bakery",
                                    "pluralName": "Bakeries",
                                    "shortName": "Bakery",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/bakery_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 128,
                                "usersCount": 43,
                                "tipCount": 2
                            },
                            "price": {
                                "tier": 1,
                                "message": "Cheap",
                                "currency": "¥"
                            },
                            "rating": 7,
                            "ratingColor": "C5DE35",
                            "ratingSignals": 16,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "tips": [
                            {
                                "id": "58cdebc60319b8386ca445f5",
                                "createdAt": 1489890246,
                                "text": "Their eclairs are sooo good! And the walnut bread is as good as in France!",
                                "type": "user",
                                "canonicalUrl": "https://foursquare.com/item/58cdebc60319b8386ca445f5",
                                "logView": true,
                                "agreeCount": 0,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 0
                                },
                                "user": {
                                    "id": "341433953",
                                    "firstName": "Isabel",
                                    "lastName": "Agrelo",
                                    "gender": "female",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/341433953-4BEPBW052KWILKML.jpg"
                                    }
                                }
                            }
                        ],
                        "referralId": "e-0-528727d411d2efaec747f344-7"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "536ba653498ee2572cbdcdeb",
                            "name": "Shanghai Beer Factory",
                            "contact": {
                                "phone": "+862133565005",
                                "formattedPhone": "+86 21 3356 5005"
                            },
                            "location": {
                                "address": "1111 Caoxi Bei Road | 漕溪北路1111号上海体育馆西侧",
                                "crossStreet": "Linglin Road | 零陵路",
                                "lat": 31.183491059023307,
                                "lng": 121.43286827558985,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.183491059023307,
                                        "lng": 121.43286827558985
                                    }
                                ],
                                "distance": 60,
                                "cc": "CN",
                                "city": "上海市",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "1111 Caoxi Bei Road | 漕溪北路1111号上海体育馆西侧 (Linglin Road | 零陵路)",
                                    "上海市",
                                    "上海市",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "50327c8591d4c4b30a586d5d",
                                    "name": "Brewery",
                                    "pluralName": "Breweries",
                                    "shortName": "Brewery",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/brewery_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 107,
                                "usersCount": 86,
                                "tipCount": 3
                            },
                            "price": {
                                "tier": 2,
                                "message": "Moderate",
                                "currency": "¥"
                            },
                            "rating": 6.7,
                            "ratingColor": "FFC800",
                            "ratingSignals": 13,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "hours": {
                                "status": "Open until Midnight",
                                "richStatus": {
                                    "entities": [],
                                    "text": "Open until Midnight"
                                },
                                "isOpen": true,
                                "isLocalHoliday": false
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "tips": [
                            {
                                "id": "56e6c242498e6ef7c85e8a85",
                                "createdAt": 1457963586,
                                "text": "Good beer but mostly european, food is ok . If u want to find european food in shanghai around this area this can be your place.😂",
                                "type": "user",
                                "canonicalUrl": "https://foursquare.com/item/56e6c242498e6ef7c85e8a85",
                                "photo": {
                                    "id": "56e6c24acd1091b0bfe6cb32",
                                    "createdAt": 1457963594,
                                    "source": {
                                        "name": "Foursquare for iOS",
                                        "url": "https://foursquare.com/download/#/iphone"
                                    },
                                    "prefix": "https://igx.4sqi.net/img/general/",
                                    "suffix": "/22169308_DXUS--4EmuK1mjTtAV6zQopqkyJ1f1TGEFhx1RIOhsY.jpg",
                                    "width": 1440,
                                    "height": 1920,
                                    "visibility": "public"
                                },
                                "photourl": "https://igx.4sqi.net/img/general/original/22169308_DXUS--4EmuK1mjTtAV6zQopqkyJ1f1TGEFhx1RIOhsY.jpg",
                                "logView": true,
                                "agreeCount": 1,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 0
                                },
                                "user": {
                                    "id": "22169308",
                                    "firstName": "Umut",
                                    "lastName": "Bakın",
                                    "gender": "male",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/GWLJZDJEREYJQEVF.jpg"
                                    }
                                }
                            }
                        ],
                        "referralId": "e-0-536ba653498ee2572cbdcdeb-8"
                    },
                    {
                        "reasons": {
                            "count": 0,
                            "items": [
                                {
                                    "summary": "This spot is popular",
                                    "type": "general",
                                    "reasonName": "globalInteractionReason"
                                }
                            ]
                        },
                        "venue": {
                            "id": "4b9c69b5f964a520cb6636e3",
                            "name": "Tasty Steak 西堤牛排",
                            "contact": {
                                "phone": "+862154246727",
                                "formattedPhone": "+86 21 5424 6727"
                            },
                            "location": {
                                "address": "天钥桥路311号4F",
                                "crossStreet": "南丹东路口",
                                "lat": 31.19172594718515,
                                "lng": 121.43774738253238,
                                "labeledLatLngs": [
                                    {
                                        "label": "display",
                                        "lat": 31.19172594718515,
                                        "lng": 121.43774738253238
                                    }
                                ],
                                "distance": 1018,
                                "postalCode": "200030",
                                "cc": "CN",
                                "city": "上海市",
                                "state": "上海市",
                                "country": "中国",
                                "formattedAddress": [
                                    "天钥桥路311号4F (南丹东路口)",
                                    "上海市",
                                    "上海市, 200030",
                                    "中国"
                                ]
                            },
                            "categories": [
                                {
                                    "id": "4bf58dd8d48988d1cc941735",
                                    "name": "Steakhouse",
                                    "pluralName": "Steakhouses",
                                    "shortName": "Steakhouse",
                                    "icon": {
                                        "prefix": "https://ss3.4sqi.net/img/categories_v2/food/steakhouse_",
                                        "suffix": ".png"
                                    },
                                    "primary": true
                                }
                            ],
                            "verified": false,
                            "stats": {
                                "checkinsCount": 107,
                                "usersCount": 75,
                                "tipCount": 4
                            },
                            "price": {
                                "tier": 4,
                                "message": "Very Expensive",
                                "currency": "¥"
                            },
                            "rating": 7.4,
                            "ratingColor": "C5DE35",
                            "ratingSignals": 10,
                            "allowMenuUrlEdit": true,
                            "beenHere": {
                                "count": 0,
                                "marked": false,
                                "lastCheckinExpiredAt": 0
                            },
                            "photos": {
                                "count": 0,
                                "groups": []
                            },
                            "hereNow": {
                                "count": 0,
                                "summary": "Nobody here",
                                "groups": []
                            }
                        },
                        "tips": [
                            {
                                "id": "4b9cf96d70c603bbe26b94b4",
                                "createdAt": 1268578669,
                                "text": "这里的服务态度很好,服务员说话都非常的轻声,环境也不错,很安静,适合情侣或者朋友来坐坐",
                                "type": "user",
                                "canonicalUrl": "https://foursquare.com/item/4b9cf96d70c603bbe26b94b4",
                                "likes": {
                                    "count": 1,
                                    "groups": [],
                                    "summary": "1 like"
                                },
                                "logView": true,
                                "agreeCount": 1,
                                "disagreeCount": 0,
                                "todo": {
                                    "count": 0
                                },
                                "user": {
                                    "id": "477343",
                                    "firstName": "popomore",
                                    "gender": "male",
                                    "photo": {
                                        "prefix": "https://igx.4sqi.net/img/user/",
                                        "suffix": "/SL5QPCUH010VXZAT.jpg"
                                    }
                                }
                            }
                        ],
                        "referralId": "e-0-4b9c69b5f964a520cb6636e3-9"
                    }
                ]
            }
        ]
    }
}




