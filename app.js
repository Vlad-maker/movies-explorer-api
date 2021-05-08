const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const signinUser = require('./routes/signin');
const signupUser = require('./routes/signup');

const app = express();

app.use(helmet());

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/moviesexplorerdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json());

app.use('/', signinUser);
app.use('/', signupUser);
app.use('/', authoriz, userRouter);
app.use('/', authoriz, moviesRouter);

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})