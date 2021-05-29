require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
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

const { PORT = 3000, LINK, NODE_ENV } = process.env;

const corsOptions = {
  origin: ['*'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

app.use('*', cors(corsOptions));
app.use(helmet());

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