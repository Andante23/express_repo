const express = require('express');
require('dotenv').config();
const app = express();




app.get('/', (req, res) => {
  res.send('Hello from Express inside Docker!');
});

app.listen(process.env.HOST, () => {
  console.log('Server running on port 3000');
});
