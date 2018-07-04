/*
 *作者：luo
 *时间：2018/7/4 0004
 *Email：hubluo@gmail.com
 *功能：模拟express
 */
const http=require("http");
module.exports=createApplication=function(){
    return app;
};

var app=function(){};

app.listen=function(){
    let server=http.createServer(app);
    //server.listen(arguments)
    server.listen.apply(server,arguments)
};