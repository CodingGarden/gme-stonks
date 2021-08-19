const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'Stock API',
  });
});

app.get('/:ticker', async (req, res, next) => {
  try {
    const { data } = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${req.params.ticker}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
