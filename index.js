/*
 *作者：luo
 *时间：2018/7/4 0004
 *Email：hubluo@gmail.com
 *功能：应用界面
 */
const express=require("./lib/IExpress.js");
const app=express();

app.use('/user', (req, res, next) => {
    console.log('请小心，进入了用户领域');
    next();
});

app
    .route('/test')
    .get(function(req, res, next) {
        res.end('get请求');
    })
    .post(function(req, res, next) {
        res.end('post请求');
    })
    .put(function(req, res, next) {
        res.end('put请求');
    });

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

const book = require('./book');

// function(req, res, next) {}
app.use('/book', book);

app.get('/user', function(req, res, next) {
    console.log('二逼用户')
    res.end('二逼用户');
});

app.listen(3000,function(){
    console.log("链接3000端口成功！");
});
