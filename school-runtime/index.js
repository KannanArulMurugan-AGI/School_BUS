const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('School Runtime Service is running!');
});

app.listen(port, () => {
  console.log(`School Runtime Service listening at http://localhost:${port}`);
});
