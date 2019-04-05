/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('buildings', {
    buildingid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    buildingname_en: {
      type: DataTypes.STRING,
      allowNull: true
    },
    buildingname_fr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'buildings'
  });
};
