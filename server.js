
import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import mysql from 'mysql2';
import cookieParser from 'cookie-parser';

// 환경변수 를 config,js에서 불러오기
import { PORT } from './public/js/config.js';

// 모듈JS에서 __filename ,__dirname을 사용하기 위해 fileURLToPath와 path 모듈을 사용
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



try{




// Express 애플리케이션 생성
const app = express();
const sessions = {}; 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // ejs 파일을 저장할 폴더

app.use(cookieParser());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by')

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: `localhost`,
  user: 'root',
  password: '1234',
  database: 'proj'
});




// MySQL  연결 유휴 로직 
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});



// 동적 라우팅 처리
app.get('/', (req, res) => {
 



  res.sendFile(path.join(__dirname, 'webpage', `index.html`));


});


app.get('/mypage', (req, res) => {    
  const sessionId = req.cookies.session_id;

  // 세션 유효성 검사
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).send('Unauthorized: Please log in.');
  }

  const userSession = sessions[sessionId];      
  res.render('mypage', { username: userSession.username });
} );  

app.get('/logout', (req, res) => {
  const sessionId = req.cookies.session_id;

  // 세션 삭제
  if (sessionId) {
    delete sessions[sessionId];
     // 쿠키 삭제
    res.clearCookie('session_id'
     , {
      httpOnly: true,      // JS에서 접근 불가 (XSS 방지)
      sameSite: 'Strict',  // CSRF 방지
      secure: false        // HTTPS라면 true로 변경
    }
    );

  }

  res.redirect(`/`);
});




app.get('/:page', (req, res) => {
  const page = req.params.page;
  
  console.debug(`Requested page: ${page}`);


  const validPages = [ 'signup'];

  if (!validPages.includes(page)) {
    return res.status(404).send('Page Not Found');
  }
  
  res.sendFile(path.join(__dirname, 'webpage', `${page}.html`));


})

app.use(express.static('public'));




app.post(`/signup`, (req, res) => {
 

  const {username,password} = req.body;
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';



  
    

   // 입력값 유효성 검사
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }


  
  // 데이터베이스에 사용자 정보 삽입
  db.query(sql, [username, password], (err, result) => {
   
    if (err) { // 삽입 오류 처리
      console.error('삽입 오류:', err);
      res.status(500).send('DB Insert Error');
      return;
    }
    res.status(201).send('User Created');
});

});












app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 입력값 유효성 검사
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  // 사용자가 입력한 정보와 데이터베이스 내의 정보 비교
  // 

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    
    // DB 조회 오류 처리
    if (err) {
      console.error('DB 조회 오류:', err);
      return res.status(500).send('DB Query Error');
    }

    if (results.length === 0) return res.status(401).send('Invalid Credentials');
    

    const user = results[0];

    if (user.password !== password) return res.status(401).send('Invalid Credentials');

 


     // 4) 로그인 성공 → session_id 발급
    const sessionId = uuidv4();

    // 5) 서버 세션 저장
    sessions[sessionId] = {
      username: user.username,
      created: Date.now()
    };

    // 6) 클라이언트 쿠키에 session_id 저장
    res.cookie('session_id', sessionId, {
      httpOnly: true,      // JS에서 접근 불가 (XSS 방지)
      sameSite: 'Strict',  // CSRF 방지
      secure: false        // HTTPS라면 true로 변경
    });



  
 
    res.redirect('/mypage');

  });


})






  







app.listen(PORT,'0.0.0.0' ,() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

}catch (error) {
  console.error('서버 오류:', error);
} 

