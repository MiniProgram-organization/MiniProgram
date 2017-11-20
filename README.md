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
  longitude: 54.454
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

##### method: GET

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

##### method: GET

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
