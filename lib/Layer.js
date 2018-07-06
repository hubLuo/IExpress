/*
 *作者：luo
 *时间：2018/7/6 0006
 *Email：hubluo@gmail.com
 *功能：路由回调执行
 */
module.exports=Layer;

function Layer(path,cb){
    this.path=path;
    this.cb=cb;
}
//执行回调
Layer.prototype.execute=function(req,res,next){
    this.cb(req,res,next);
};
// 匹配路径
Layer.prototype.match = function(path) {
    return this.path === path;
}
