/*
 *作者：luo
 *时间：2018/7/5 0005
 *Email：hubluo@gmail.com
 *功能：扩展app方法和属性
 */
/*
 *作者：luo
 *时间：2018/7/4 0004
 *Email：hubluo@gmail.com
 *功能：app模块的入口
 */
const http=require("http");
const url=require("url");
var methods=require("./methods");
var Route=require("./Route");

module.exports=app=function(req,res){
    app.handle(req,res);
};

app.init=function(){
    //用以保存声明式Route对象
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
        //为了处理路由的多句柄，将Route的path和cb属性分开创建
        var cbs=Array.prototype.slice.call(arguments,1);
        var route=app.route(path);
        route[method].apply(route,cbs);
        this.stack.push(route);
    };
});

//处理路由绑定
app.route=function(path){
    var route=new Route(path);
    return route;
}

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
        route.dispatch(req,res);
    }else{
        res.end("404");
    }
    //res.end(pathName);
};