/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('genders', {
    genderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gendername: {
      type: DataTypes.STRING,
      allowNull: true
    },
    genderinfo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'scoop',
    tableName: 'genders'
  });
};
