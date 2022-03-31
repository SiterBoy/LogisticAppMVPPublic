/* eslint-disable default-case */
const router = require('express').Router();
const { Op } = require('sequelize');
const { City, Company, Route } = require('../db/models');

router
  .route('/city')
  .post(async (req, res) => {
    const { name } = req.body;
    try {
      const newCity = await City.create({ name });
      res.render('partials/onecity', { layout: false, name: newCity.name, id: newCity.id });
    } catch (err) {
      res.sendStatus(500);
    }
  });

router
  .route('/city/:id')
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await City.destroy({ where: { id } });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
// .update(async (req, res) => {

// });

router
  .route('/cities')
  .get(async (req, res) => {
    try {
      const cities = await City.findAll({ raw: true, order: [['name', 'DESC']] });
      res.json(cities);
    } catch (err) {
      res.sendStatus(500);
      console.log(`.route('/cities') ------ ${err}`);
    }
  });

router
  .route('/company')
  .post(async (req, res) => {
    const {
      name, description, inn, phone
    } = req.body;
    try {
      const newCompany = await Company.create({
        name, description, inn, phone
      });
      res.render('partials/onecompany', {
        layout: false,
        name: newCompany.name,
        id: newCompany.id,
        description: newCompany.description,
        inn: newCompany.inn,
        phone: newCompany.phone
      });
    } catch (err) {
      res.sendStatus(500);
    }
  });

router
  .route('/company/:id')
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await Company.destroy({ where: { id } });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

router
  .route('/company/:id/routes')
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const routes = await Route.findAll({
        raw: true,
        attributes: ['id'],
        include: [{
          model: Company,
          attributes: ['id', 'name'],
          required: true,
          where: {
            id
          }
        },
        {
          model: City,
          as: 'cityTo',
          attributes: ['name']
        },
        {
          attributes: ['name'],
          model: City,
          as: 'cityFrom'
        }]
      });
      console.log(routes);
      const cities = await City.findAll({ raw: true });
      const resp = {
        title: 'Маршурты компании', id, routes, cities
      };
      res.render('account/routesOfCompany', resp);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

router
  .route('/companys')
  .get(async (req, res) => {
    try {
      const companys = await Company.findAll({ raw: true });
      res.json(companys);
    } catch (err) {
      res.sendStatus(500);
      console.log(`.route('/companys') ------ ${err}`);
    }
  });

router
  .route('/company/:id/route')
  .post(async (req, res) => {
    const { id } = req.params;
    const { from_city_id, to_city_id } = req.body;
    try {
      await Route.create({ company_id: id, from_city_id, to_city_id });
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
      console.log(err);
    }
  });

router
  .route('/route/:id')
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await Route.destroy({ where: { id } });
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
      console.log(err);
    }
  });

router
  .route('/routes')
  .get(async (req, res) => {
    try {
      const routes = await Route.findAll({
        attributes: [],
        raw: true,
        include: [{
          model: Company,
          required: true,
          attributes: ['id', 'name']
        },
        {
          model: City,
          as: 'cityTo',
          attributes: ['id', 'name']
        },
        {
          model: City,
          as: 'cityFrom',
          attributes: ['id', 'name']
        }]
      });

      res.json(routes);
    } catch (err) {
      res.sendStatus(500);
    }
  });

router
  .route('/routes-main/')
  .post(async (req, res) => {
    const { fromCity, company, toCity } = req.body;
    const companyCondition = (company !== undefined) ? { id: company } : { id: { [Op.not]: null } };
    const fromCityCondition = (fromCity !== undefined) ? { id: fromCity } : { id: { [Op.not]: null } };
    const toCityCondition = (toCity !== undefined) ? { id: toCity } : { id: { [Op.not]: null } };
    try {
      const routes = await Route.findAll({
        attributes: [],
        raw: true,
        include: [{
          model: Company,
          required: true,
          attributes: ['id', 'name'],
          where: companyCondition
        },
        {
          model: City,
          as: 'cityTo',
          attributes: ['id', 'name'],
          where: toCityCondition
        },
        {
          model: City,
          as: 'cityFrom',
          attributes: ['id', 'name'],
          where: fromCityCondition
        }]
      });

      const companies = routes.map((elem) => {
        if (company === undefined) {
          return {
            id: elem['Company.id'],
            name: elem['Company.name']
          };
        }
        return {
          checked: true,
          id: elem['Company.id'],
          name: elem['Company.name']
        };
      });

      const citiesFrom = routes.map((elem) => {
        if (fromCity === undefined) {
          return {
            id: elem['cityFrom.id'],
            name: elem['cityFrom.name']
          };
        }
        return {
          checked: true,
          id: elem['cityFrom.id'],
          name: elem['cityFrom.name']
        };
      });

      const citiesTo = routes.map((elem) => {
        if (toCity === undefined) {
          return {
            id: elem['cityTo.id'],
            name: elem['cityTo.name']
          };
        }
        return {
          checked: true,
          id: elem['cityTo.id'],
          name: elem['cityTo.name']
        };
      });

      res.json({ companies, citiesTo, citiesFrom });
    } catch (err) {
      res.sendStatus(500);
    }
  });

module.exports = router;
