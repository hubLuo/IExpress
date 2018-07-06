/*
 *作者：luo
 *时间：2018/7/6 0006
 *Email：hubluo@gmail.com
 *功能：路由回调执行
 */
module.exports=Layer;

function Layer(path,cb,end=true){
    this.path=path;
    this.cb=cb;
    // 表示是否需要完全匹配路径，end 为 true 则需要
    this.end = end;
}
//执行回调
Layer.prototype.execute=function(req,res,next){
    this.cb(req,res,next);
};
// 匹配路径
Layer.prototype.match = function(path) {
    //return this.path === path;
    // 路由层 / 中间件层
    if (this.end) return this.path === path;
    return path && path.startsWith(this.path);
}
