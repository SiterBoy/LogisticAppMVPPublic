const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Company, City }) {
      this.belongsTo(Company, { foreignKey: 'company_id' });
      this.belongsTo(City, { as: 'cityFrom', foreignKey: 'from_city_id' });
      this.belongsTo(City, { as: 'cityTo', foreignKey: 'to_city_id' });
    }
  }
  Route.init({
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Company',
        key: 'id'
      }
    },
    from_city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'City',
        key: 'id'
      }
    },
    to_city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'City',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Route'
  });
  return Route;
};
