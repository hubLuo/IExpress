/*
 *作者：luo
 *时间：2018/7/4 0004
 *Email：hubluo@gmail.com
 *功能：模拟express
 */
const http=require("http");
const url=require("url");
var methods=["get","post","put","delete"];
module.exports=createApplication=function(){
    app.init();
    return app;
};

var app=function(req,res){
    app.handle(req,res);
};

app.init=function(){
    app.stack=[];
};

// 注册启动监听回调函数
app.listen=function(){
    let server=http.createServer(app);
    //server.listen(arguments)
    server.listen.apply(server,arguments)
};

methods.forEach(function(method){
    app[method]=function(path,cb){
        this.stack.push(new Route(path,cb));
    };
});

function Route(path,cb){
    this.path=path;
    this.cb=cb;
}

Route.prototype.match=function(path){
    return this.path===path;
};

// 执行请求
app.handle=function(req,res){
    var pathName=url.parse(req.url).pathname;
    let stack=this.stack,idx=0,match,route;
    while(match !==true && idx<stack.length){
        // 先stack[idx]取值再 ++
        route=stack[idx++];
        match=route.match(pathName);
    }
    res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
    if(match){
        route.cb(req,res)
    }else{
        res.end("404");
    }
    //res.end(pathName);
};