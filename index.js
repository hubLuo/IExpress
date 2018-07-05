/*
 *作者：luo
 *时间：2018/7/4 0004
 *Email：hubluo@gmail.com
 *功能：应用界面
 */
const express=require("./lib/IExpress.js");
const app=express();

app.get('/user',function(req, res, next){
    console.log("多句柄路由");
}, function(req, res, next) {
    res.end('二逼用户');
});

app.listen(3000,function(){
    console.log("链接3000端口成功！");
});
