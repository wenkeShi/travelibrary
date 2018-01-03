# 流动图书馆
流动图书馆是一个图书漂流和借阅工具，旨在共享闲置图书，并链接趣味相投的小伙伴。

# 预览
[链接](http://xinwenke.top/travelib/)

![image](http://xinwenke.top/assets/images/travelib_code.jpg)

# 技术栈

- **小程序MINA框架**： 一个响应的数据绑定框架。分为两块视图层(View)和逻辑层(App Service)
- **Flex**：flex弹性布局
- **Express** : http服务框架
- **websocket**: 前后端消息的实时推送
- **mongoose**: 操作mongodb数据库
- **pm2**: 服务端使用pm2部署，常驻进程

# 截图
> 首页

![1.png](http://upload-images.jianshu.io/upload_images/7234109-a26a4629a511bd9e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 借阅书架

![2.png](http://upload-images.jianshu.io/upload_images/7234109-b493fc714d417e2e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 发布的图书

![3.png](http://upload-images.jianshu.io/upload_images/7234109-5445d402963acf4b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 借阅的图书

![4.png](http://upload-images.jianshu.io/upload_images/7234109-76ddee279c861e3a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 客户端

- 代码结构

![image.png](http://upload-images.jianshu.io/upload_images/7234109-c6fa3ff47400d6a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

微信小程序中每个页面会有四个文件 ```.js``` ```.json``` ```.wxml``` ```.wxss```
js文件中是页面的逻辑，json文件是页面的一些配置，wxml是小程序的页面结构，wxss为页面的样式。

- 封装http请求

```
const request = (obj) => {
  if(obj.header){
    obj.header.sessionId = session.sessionId;
  }else{
    obj.header = { sessionId: session.sessionId};
  }
  wx.request(obj);
}
```
在请求头中手动加上sessionId,因为小程序没有cookie。

- websocket
```
//连接websocket
wx.connectSocket({
  url: 'wss://liudongtushuguan.cn/socket?sessionId=' + session.sessionId,
});

wx.onSocketOpen(function(res){

});
wx.onSocketClose(function(res){
  console.log('websocket closed');
});

wx.onSocketMessage(function(res){  //收到消息的回调
  let msg = JSON.parse(res.data);
  let msgs = that.data.borrowMessage;
  msgs.unshift(msg);
  that.setData({ borrowMessage: msgs});
});

```
```
//发送socket消息
  let data = JSON.stringify({
    targetId: bookData.ownerId,
    nickName: APP.globalData.userInfo.nickName,
    bookName: bookData.title,
    time: new Date().toLocaleString(),
    bookId: bookId,
    wxNum: wxNum,
    phoneNum: phoneNum,
    msg: msg,
  });
  wx.sendSocketMessage({
    data: data,
  });
```
# 服务端

- 代码目录

![image.png](http://upload-images.jianshu.io/upload_images/7234109-60e7d1528ee6f219.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- Express框架实现http服务
```
const https = require('https');
const fs = require('fs');
const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const queryString = require('querystring');
const URL = require('url');
const socket = require('./service/socket');

const router = require('./routes/router').router;

//获取认证证书
var key = fs.readFileSync('./key/2_www.liudongtushuguan.cn.key');
var cert = fs.readFileSync('./key/1_www.liudongtushuguan.cn_bundle.crt');

var options = {
	key : key,
	cert : cert,
};

app.use(cookieParser());
app.use(bodyParser.json());

const httpsServer = https.createServer(options,app);
httpsServer.listen(443,() =>{
    console.log('listening 443 port');
});

socket(httpsServer);  //websocket

app.use(router);
```
小程序规定必须要用https协议。

- websocket模块

这里使用ws模块而没有选择使用socket.io，因为小程序客户端不支持socket.io

```
const WebSocket = require('ws');  //使用ws模块
const queryString = require('querystring');
const URL = require('url');
const sessions = require('./session');



module.exports = (httpServer) => {

	const wss = new WebSocket.Server({server : httpServer});

	wss.on('connection',(ws, req) => {
			let sessionId = queryString.parse(URL.parse(req.url).query).sessionId;
			ws.id = sessionId;
    	    ws.on('message' , (msg) => {
    	    		let msgObj = JSON.parse(msg);
    	    		if(sessions[msgObj.targetId]){
    	    			wss.clients.forEach((client) => {
    					if(client.id === msgObj.targetId){
    						let data = {
    							time : msgObj.time,
    							borrower :msgObj.nickName, 
    							book :msgObj.bookName,
    							borrowerId : sessions[sessionId],
    							bookId : msgObj.bookId,
    							wxNum : msgObj.wxNum,
    							phoneNum : msgObj.phoneNum,
    							msg : msgObj.msg
    						};
    						client.send(JSON.stringify(data));
    					}
    				});
    	    		}
    	    });
	});
};
```
- mongoose操作数据库

```db.js:```

```
const mongoose = require('mongoose');

mongoose.connect('mongodb://app:12345678@127.0.0.1/wxapp');

const connection = mongoose.connection;
connection.once('open', (err) => {
	if(err){
		console.log('Database connection failure');
	}else{
		console.log('Database opened');

	}
});

connection.on('error',(err) => {
	console.log('Mongoose connected error '+ err);
});

connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

module.exports = {
	connection : connection,
	mongoose : mongoose,
};
```
```model.js:```
```
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	onlyId : {type: String},
	publishedBooks : {type: Array},
	borrowedBooks : {type: Array},
	borrowMessages : Array, 
});

const BookSchma = new Schema({
	isbn : String,
	title : String,
	press : String,
	author : String,
	rate : String,
	tags : String,
	image : String,
	status : {type : Boolean,default : true},
	ownerId : String,
	owner : String,
	ownerImage : String,
});

const userModel =  mongoose.model('user' , UserSchema);
const bookModel = mongoose.model('book' , BookSchma);

module.exports = {
	UserModel  : userModel,
	BookModel : bookModel,
}
```
- 获得微信用户的openId

小程序前端会请求微信服务器得到一个code, 将code发送给自己的服务器，然后自己的服务器给微信服务器发送请求，得到微信用户的唯一标识openId

```
const https = require('https');
const queryString = require('querystring');

const sessions = require('./session');


module.exports = (req, res, next) => {
		let code = req.query.code;
		let otherRes = res;
		DATA.js_code = code;
		OPTION.path = PATH + queryString.stringify(DATA);
		let wxReq = https.request(OPTION, (res) => {
			if(res.statusCode == 200){
				let json = '';
				res.on('data' , (data) => {
					json+=data;
				});
				res.on('end' , () => {
					json =JSON.parse(json);
					let openId = json.openid;
					sessions[openId] = openId;
					otherRes.type('application/json');
					otherRes.json({
						data : {'sessionId' : openId},
					});
					otherRes.status(200);
				});
			}
		});
		wxReq.end();
};
```
# 使用pm2部署

安装pm2
```
npm install  -g pm2
```
启动应用
```
pm2 start app.js
```
# 总结
流动图书馆小程序是由三个人的小团队设计和开发的。我主要负责前后端的开发工作。这对从来没接触过服务端和小程序开发的我来说是一个挑战当然也是一次难得的学习机会。从最初对小程序，服务端两眼一抹黑，到搭建出应用的雏形，实现基本的效果，再到最后的拆分整合代码，这期间经历了很多，也收获了很多。从数据库的设计到后台数据库操作、会话管理、http服务接口一直到前后端数据交互、小程序前端，我对程序开发的大致流程有了更进一步的了解，弥补的之前对服务端知识的缺失。

三个人的小团队，因为兴趣结在一起，利用工作之余的时间完成自己喜欢的事情真的是一件令人十分有成就感的事情。

有兴趣的可以看源码

[小程序前端](https://github.com/wenkeShi/travelibrary)

[小程序后端](https://github.com/wenkeShi/wxapp)

如果觉得不错，就毫不吝啬地给个star吧。后期项目还会继续更新和完善。
