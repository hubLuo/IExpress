/*
 *作者：luo
 *时间：2018/7/5 0005
 *Email：hubluo@gmail.com
 *功能：路由对象
 */
var methods=require("./methods");
module.exports = Route;

function Route(path){
    this.path=path;
    //this.cb=cb;
    //用以保存声明式路由中的响应方法
    this.stack=[];
}

Route.prototype.match=function(path){
    return this.path===path;
};

methods.forEach(function(method){
    Route.prototype[method]=function(){
        var cbs=Array.prototype.slice.call(arguments);//将伪对象变为数组
        for(var i=0;i<cbs.length;i++){
            this.stack.push(cbs[i]);
        }
    }
});

Route.prototype.dispatch=function(req,res){
    for(var i=0;i<this.stack.length;i++){
        this.stack[i](req,res);
    }
}