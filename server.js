
import express from 'express';
import fs  from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 환경변수 를 config,js에서 불러오기
import { API_PATH , PORT } from './public/js/config.js';


// 모듈JS에서 __filename ,__dirname을 사용하기 위해 fileURLToPath와 path 모듈을 사용
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express 애플리케이션 생성
const app = express();


// 이미지, css , js 등 정적 파일 제공
app.use(express.static('public'));

// 미들웨어
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));



// 샘플 JSON 파일을 읽어와서 응답하는 API 엔드포인트
app.get(`${API_PATH}`, (req, res) => {
 
  const filePath = path.join(__dirname, 'data', 'sample.json');
 
  // json 파일 읽기
  fs.readFile(filePath, 'utf8', (err, data) => {
    // json 파일 읽기 오류 처리
    if (err) { 
      console.error("발생한 에러:", err);  // 추가!!
      return res.status(500).json({ error: err.message });
    }

    // json 파일 파싱 및 응답
    res.json(JSON.parse(data));
  });
});


// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

