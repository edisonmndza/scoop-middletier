/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('genders', {
    genderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'genderid'
    },
    gendername: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'gendername'
    },
    genderinfo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'genderinfo'
    }
  }, {
    tableName: 'genders'
  });
};
