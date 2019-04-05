/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('positions', {
    positionid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    positionname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
<<<<<<< HEAD
    schema: 'scoop',
=======
>>>>>>> f1b90cb4b960a3b5ee4bf0ce35eda18c376c080a
    tableName: 'positions'
  });
};
