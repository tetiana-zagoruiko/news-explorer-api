const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT = 3000 } = process.env;
const app = express();
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const {NotFoundError} = require('./errors/errors');
require('dotenv').config();
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const { login, createUser } = require('./controllers/users');
const { NODE_ENV, MONGO_ADDRESS } = process.env;

app.use(cors());
app.options('*', cors());

mongoose.connect(NODE_ENV === 'production' ? MONGO_ADDRESS : 'mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string(),
  }),
}), createUser);
app.use('/users', auth, usersRouter);
app.use('/articles', auth, articlesRouter);
app.get('*', (req, res) => {
  throw new NotFoundError('Requested resource not found')
})

app.use(errorLogger);

app.use(errors());

app.use(((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
}));

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const { statusCode = 400, message } = err;
    res
      .status(400)
      .send({
        message: statusCode === 400
          ? 'Invalid data passed'
          : message
      });
  };
  if (err.name === 'MongoError' && err.code === 11000) {
    const { statusCode = 409, message } = err;
    res
      .status(409)
      .send({
        message: statusCode === 409
          ? 'Email already exists in the database'
          : message
      });
  };
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`)
});
