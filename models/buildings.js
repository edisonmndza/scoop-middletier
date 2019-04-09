/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('buildings', {
    buildingid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'buildingid'
    },
    buildingnameEn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'buildingname_en'
    },
    buildingnameFr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'buildingname_fr'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'address'
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'city'
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'province'
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'postalcode'
    }
  }, {
    tableName: 'buildings'
  });
};
