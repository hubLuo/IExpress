/*
 *作者：luo
 *时间：2018/7/7 0007
 *Email：hubluo@gmail.com
 *功能：路由层，中间件层，层
 */
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
const url = require('url');
var methods=require("../methods");
var Route=require("../Route");
var Layer=require("../Layer");

// 导出函数，该函数返回一个函数，且挂载了扩展方法
module.exports=function createRouter(){
    //中间件函数
    function router(req,res,next){
        router.handle(req,res,next);
    }
    router.__proto__=proto;
    // 保存 layer 对象的数组，layer 中的 fn 为 Route.prototype.dispatch
    // proto.stack = [];// 会出现问题
    router.stack = [];
    return router;
};

var proto={};

methods.forEach(function(method){
    proto[method]=function(path,cb){
        //为了处理路由的多句柄，将Route的path和cb属性分开创建
        var cbs=Array.prototype.slice.call(arguments,1);
        var route=proto.route(path);
        route[method].apply(route,cbs);

    };
});

//注册绑定路由
proto.route=function(path){
    var route=new Route(path);
    var layerProto=new Layer(path,route.dispatch.bind(route));
    // 关联对应的 route
    layerProto.route = route;
    this.stack.push(layerProto);
    return route;
}

//注册中间件
proto.use=function(cb){
    //中间件默认参数配置
    let path = '/';
    let callback = cb;
    if (typeof cb !== 'function') {
        // 传递的第一个参数为路径
        path = cb;
        callback = Array.prototype.slice.call(arguments, 1)[0];
    }
    this.stack.push(new Layer(path,callback,false));
}

// 执行请求
proto.handle=function(req,res){
    var pathName=url.parse(req.url).pathname;
    let stack=this.stack,idx=0;
    res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
    // 子模块中间件调用时，需要移除的路径
    let removed = '';
    next();
    function next(){
        // 复原 req.url 的更改
        // req.url = '/' removed = '/book' '/book/'
        /*
        * 子模块中间件路径调整方案
        * */
        if (req.url === '/') {
            req.url = '';
        }
        if (removed.length !== 0) {
            req.url = req.baseUrl + req.url;
            removed = '';
            req.baseUrl = '';
        }
        let match=false,layerProto,route;
        while(match !==true && idx<stack.length){
            // 先stack[idx]取值再 ++
            layerProto=stack[idx++];
            match=layerProto.match(pathName);
            route = layerProto.route;
            // 路径匹配的路由层，不支持该 http 方法
            if (match && route && !route._execute_method(req.method)) {
                match = false;
                continue;
            }
        }
        if(match){
            if (route) {
                // 路由层
                // 匹配到 layer 对象，则调用对应的处理方法
                layerProto.execute(req, res, next);
            } else {
                // 中间件层
                // 去除路径前缀之后在处理
                /*
                 * 子模块中间件路径调整方案
                 * */
                removed = layerProto.path;
                // '/bookbook' => 'book'
                req.url = req.url.substr(removed.length);
                if (req.url.length === 0) {
                    req.url = '/';
                }
                req.baseUrl = removed;
                // 进入router模块开始处理
                layerProto.execute(req, res, next);
            }
            //layerProto.execute(req,res,next);
        }else{
            res.end("504");
        }
    }
    //res.end(pathName);
};