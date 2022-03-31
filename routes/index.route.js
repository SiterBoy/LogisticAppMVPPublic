const router = require('express').Router();
const axios = require('axios');
const { isSession, isNotSession, isNotSessionIndex } = require('../middleware');

router.get('/', isNotSessionIndex, async (req, res) => {
  try {
    const responseOfCompanies = await axios.get(`${req.protocol}://${req.get('host')}/api/v1/companys`);
    const responseOfCities = await axios.get(`${req.protocol}://${req.get('host')}/api/v1/cities`);
    const companies = responseOfCompanies.data;
    const cities = responseOfCities.data;
    res.render('index', {
      title: 'Панель визуализации маршрутов', companies, citiesFrom: cities, citiesTo: cities
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get('/login', isNotSession, (req, res) => {
  res.render('login', { title: 'Авторизация на сайте' });
});

router.get('/registration', isNotSession, (req, res) => {
  res.render('registration', { title: 'Регистрация на сайте' });
});


router.get('/account/cities', isSession, async (req, res) => {
  const response = await axios.get(`${req.protocol}://${req.get('host')}/api/v1/cities`);
  const cities = response.data;
  res.render('account/cities', { title: 'Управление городами', cities });
});

router.get('/account/companys', isSession, async (req, res) => {
  const response = await axios.get(`${req.protocol}://${req.get('host')}/api/v1/companys`);
  const companys = response.data;
  res.render('account/companys', { title: 'Управление компаниями', companys });
});

module.exports = router;
