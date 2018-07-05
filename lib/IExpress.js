/*
 *作者：luo
 *时间：2018/7/4 0004
 *Email：hubluo@gmail.com
 *功能：app模块的入口/导入模块
 */
const app=require("./application");
module.exports=createApplication=function(){
    app.init();
    return app;
};
