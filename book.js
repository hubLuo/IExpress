const express = require('./lib/IExpress');
const router = express.Router();

router.use((req, res, next) => {
  console.log('请求时间：', new Date().toLocaleString());
  next();
});

router
  .route('/')
  .get((req, res) => {
    res.end('这是来自book模块的Get消息');
  })
  .post((req, res) => {
    res.end('这是来自book模块的Post消息');
  });

module.exports = router;
