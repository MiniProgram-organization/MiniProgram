# MiniProgram

## 目前完成的功能：

#### 1.注册界面

#### 2.完整的鉴权和保持session机制

后来发现，加密只是为了业务服务器和客户端之间通信的安全，为了简便起见，对目前来说没有必要，现在可以把**rawData**（包括用户昵称，用户身份等信息）直接发到服务器上面去， 由青鸟翰直接存入数据库，然后返回给客户端**openid**（作为和服务器交换数据的用户标识），之后每个用户请求的时候带上openid即可。和服务器数据交换细节见[交接](#index)。 

#### 3.将多个标注点画到地图上

目前使用的是腾讯小程序提供的地图，后续如果功能丰富可能会用到百度地图的api，和服务器数据交换的细节见[交接](#index)

#### 4.天气的API使用的是和风天气API，官网地址为：[https://www.heweather.com](https://www.heweather.com)


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

##### 相关函数：`getOpenId()`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/Login](https://40525433.fudan-mini-program.com/cgi-bin/Login)

##### method: POST

##### 发送数据格式： 

```json
{
  code: "013VSxwK1xExW70pcryK10EJwK1VSxw6"
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

##### 相关函数：`register()`

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
  Tel: "15202345235",
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
  category:"school",
  venue: "Fudan University",
  poi_lat: "12.3", //poi所在纬度
  poi_lng: "55.4", //poi所在经度
  city: "Shanghai",
  country: "China",
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
  status: "OK"
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
        "cond": {
            "code": "100",
            "txt": "晴"
        },
        "fl": "29",
        "hum": "81",
        "pcpn": "0",
        "pres": "1004",
        "tmp": "27",
        "vis": "7",
        "wind": {
            "deg": "216",
            "dir": "西南风",
            "sc": "3-4",
            "spd": "13"
        }
    },
    "city": "北京",
    "country": "中国"
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
          "datetime": "2017-07-01 08:08:08.213",
          "category": "school",
          "latitude": 23.123,
          "longitude": 123.123
        },
        {
          "POI_id": "23242",
          "venue": "Peking University",
          "datetime": "2017-07-02 08:08:08.123",
          "category": "school",
          "latitude": 43.123,
          "longitude": 123.123
        },
        {
          "POI_id": "3432423",
          "venue": "Peking University",
          "datetime": "2017-08-16 10:10:10.321",
          "category": "school",
          "latitude": 43.123,
          "longitude": 123.123
        }
      ]
}
```

#### 7.查看POI签到情况

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


