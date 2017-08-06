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
  rawData: {"nickName":"hazelnut",
            "gender":1,
            "language":"zh_CN",
            "city":"",
            "province":"Chongqing",
            "country":"China",                  
            "avatarUrl":"https://wx.qlogo.cn"
            }
  username: "老板最帅",
  Tel: "15202345235",
}
```

##### 接收数据格式:

```json
{
  status: "OK"
}
```


#### 3.发送当前地址，换取附近POI信息

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
        "POI_id":1,
        "category":"school",
        "venue":"Fudan University",
        "longitude": 123.324,
        "latitude": 50
    },
    {
        "POI_id":2,
        "category":"residence",
        "venue":"lsh's dormitory",
        "longitude": 123.43535,
        "latitude": 50.334
    }......
  ]
}
```


#### 4.签到

##### 相关函数：`checkPosition()`

##### url: [https://40525433.fudan-mini-program.com/cgi-bin/CheckIn](https://40525433.fudan-mini-program.com/cgi-bin/CheckIn)

##### method: POST

##### 发送数据格式： 

```json
{
  POI_id: 1,
  created_by_user: false,
  openid: "haasdfasf",
  latitude: 10.43535,
  longitude: 54.454
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

