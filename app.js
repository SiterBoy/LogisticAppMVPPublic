require('dotenv').config();

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
// const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');
const hbs = require('hbs');

// Импортируем созданный в отдельный файлах рутеры.
const indexRouter = require('./routes/index.route');
const apiRouter = require('./routes/api.route');
const userRouter = require('./routes/user.route');

const app = express();
const PORT = 3000;

const sessionConfig = {
  store: new FileStore(),
  key: 'zid',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  httpOnly: true,
  cookie: { expires: 24 * 60 * 60e3 }
};

app.use(session(sessionConfig));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (req.session) {
    res.locals.userId = req.session.userId;
    res.locals.login = req.session.login;
  }
  next();
});

app.use('/', indexRouter);
app.use('/api/v1', apiRouter);
app.use('/user', userRouter);

// 404
app.use((req, res, next) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}`);
});
