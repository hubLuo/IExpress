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
var methods=require("./methods");
const Router = require('./router');

module.exports=app=function(req,res){
    app.handle(req,res);
};

// 注册启动监听回调函数
app.listen=function(){
    let server=http.createServer(app);
    //server.listen(arguments)
    server.listen.apply(server,arguments)
};

// 定义默认代理实例的懒加载方法
app.lazyrouter = function() {
    // 如果不存在代理，则初始化一个
    if (!this._router) {
        this._router = new Router();
    }
}

methods.forEach(function(method){
    app[method]=function(path,cb){
        //为了处理路由的多句柄，将Route的path和cb属性分开创建
        var cbs=Array.prototype.slice.call(arguments,1);
        var route=app.route(path);
        route[method].apply(route,cbs);

    };
});

//注册绑定路由 委托给代理的对应方法
app.route=function(path){
    this.lazyrouter();
    return this._router.route(path);
}

//注册中间件 委托给代理的对应方法
app.use=function(path,cb){
    this.lazyrouter();
    return this._router.use(path, cb);
}

// 执行请求 委托给代理的对应方法
app.handle=function(req,res){
    let router = this._router;
    if (!router) {
        // 没有定义任何的路由和中间件的情况
        res.end('404');
    } else {
        router.handle(req, res);
    }
};