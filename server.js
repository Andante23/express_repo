const express = require('express');
require('dotenv').config();
const app = express();
const fs = require('fs');
const path = require('path');


// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static('public'));

// ejs 템플릿 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));



// 유저가 / 경로로 접속했을 때 index.html 파일을 제공합니다.
app.get('/', (req, res,next) => {
 res.sendFile(path.join(__dirname, 'webpage', 'index.html') , function (err) {
  // 에러가 발생하면 500 상태 코드와 에러 메시지를 로그파일에 남김니다.
    if (err) {  next(err);}
  }); 
});

app.use((err, req, res, next) => {
  res.status(500).render('error', {
    message: err.message,
    stack: err.stack
  });
});





const  PORT  = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


