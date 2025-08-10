const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Subscription Manager is running!');
});

app.listen(port, () => {
  console.log(`Subscription Manager listening at http://localhost:${port}`);
});
