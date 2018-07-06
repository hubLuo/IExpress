/*
 *作者：luo
 *时间：2018/7/4 0004
 *Email：hubluo@gmail.com
 *功能：应用界面
 */
const express=require("./lib/IExpress.js");
const app=express();

app.get(
    '/user',
    function(req, res, next) {
        //使用user 和user?测试
        if (req.url.length % 2 === 0) next('route');
        else next();
    },
    function(req, res, next) {
        console.log('普通用户')
        //next("route");
        //console.log('普通用户2')
        res.end('普通用户');
    }
);

app.get('/user', function(req, res, next) {
    console.log('二逼用户')
    res.end('二逼用户');
});

app.listen(3000,function(){
    console.log("链接3000端口成功！");
});
