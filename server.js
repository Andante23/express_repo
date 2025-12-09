
import express from 'express';
import fs  from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { API_PATH , PORT } from './public/js/config.js';

const app = express();
app.use(express.static('public'));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));



// JSON API
app.get(`${API_PATH}`, (req, res) => {
 
  const filePath = path.join(__dirname, 'data', 'sample.json');
 
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("발생한 에러:", err);  // 추가!!
      return res.status(500).json({ error: '파일 읽기 오류' });
    }

    res.json(JSON.parse(data));
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

