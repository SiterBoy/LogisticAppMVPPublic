'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Route }) {
      this.hasOne(Route, { foreignKey: 'from_city_id' });
      this.hasOne(Route, { foreignKey: 'to_city_id' });
    }
  }
  City.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'City'
  });
  return City;
};
