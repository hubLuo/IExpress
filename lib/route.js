/*
 *作者：luo
 *时间：2018/7/5 0005
 *Email：hubluo@gmail.com
 *功能：路由对象
 */
var methods=require("./methods");
var Layer=require("./layer");
module.exports = Route;

function Route(path){
    this.path=path;
    //this.cb=cb;
    //用以保存声明式路由中的响应方法
    this.stack=[];
    // 保存该路由支持的 http 方法
    this.methods = {};
}

Route.prototype.match=function(path){
    return this.path===path;
};

// 判断路由是否支持该 http 方法，返回布尔值
Route.prototype._execute_method = function(method) {
    method = method.toLowerCase();
    return Boolean(this.methods[method]);
}

methods.forEach(function(method){
    Route.prototype[method]=function(){
        var cbs=Array.prototype.slice.call(arguments);//将伪对象变为数组
        for(var i=0;i<cbs.length;i++){
            var layerRoute=new Layer(this.path,cbs[i]);
            this.methods[method] = true;
            layerRoute.method = method;
            this.stack.push(layerRoute);
            //this.stack.push(cbs[i]);
        }
        return this;
    }
});
// 调用该route内所有的回调函数
Route.prototype.dispatch=function(req,res,next){
    let idx = 0;
    let stack = this.stack;
    function nextCb(str){
        if(str && str==="route"){
            return next();
        }
        let layerRoute = stack[idx++];
        // 判断当前的路由回调函数是否支持该 http 方法
        let method = req.method.toLowerCase();
        if (layerRoute.method !== method) {
            nextCb(str);
        }
        layerRoute.execute(req,res,nextCb);
    }
    nextCb();
 /*   for(var i=0;i<this.stack.length;i++){
        this.stack[i](req,res,next);
    }*/
}
