const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const { isSession, isNotSession } = require('../middleware');

const saltRounds = 5;

router
  .route('/register')
  .post(async (req, res) => {
    const { login, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({ login, password: hashedPassword });
      req.session.userId = newUser.id;
      req.session.login = newUser.login;
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  });

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ raw: true, where: { login } });
    if (await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      req.session.login = user.login;
      res.json({ success: true, redirect: '/' });
    } else {
      res.json({ success: false, error: 'Неправильный логин или пароль' });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/logout', (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('zid');
    res.redirect('/');
  } catch (err) {
    res.end();
  }
});

router.get('/user/registration', (req, res) => {
  res.render('registration', { title: 'Зарегистрироваться' });
});

module.exports = router;
