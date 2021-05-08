const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/moviesexplorerdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});



app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})