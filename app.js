const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { BD_DEV_HOST } = require('./utils/config');
const { centralErrors } = require('./utils/centralErrors');
const { authoriz } = require('./middlewares/auth');
const signinUser = require('./routes/signin');
const signupUser = require('./routes/signup');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const NotFoundError = require('./errors/NotFound_Error_404');

const app = express();
app.use(helmet());

const { PORT = 3000, LINK, NODE_ENV } = process.env;
mongoose.connect(NODE_ENV === 'production' ? LINK : BD_DEV_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json());
app.use(requestLogger);

app.use('/', signinUser);
app.use('/', signupUser);
app.use('/', authoriz, userRouter);
app.use('/', authoriz, moviesRouter);

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());
app.use(centralErrors);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})