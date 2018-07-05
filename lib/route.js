/*
 *作者：luo
 *时间：2018/7/5 0005
 *Email：hubluo@gmail.com
 *功能：路由对象
 */
module.exports = Route;

function Route(path,cb){
    this.path=path;
    this.cb=cb;
}

Route.prototype.match=function(path){
    return this.path===path;
};
