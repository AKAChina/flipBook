const express = require('express');
const app = express();

// 将静态资源目录设置为 public 目录
app.use(express.static('public'));

// 启动服务器
app.listen(8081, () => {
  console.log('Server is running on http://localhost:8081');
});
app.get('/assets/images/:image_name', (req, res) => {
  const imageName = req.params.image_name;
  res.sendFile(`${__dirname}/public/assets/images/${imageName}`);
});