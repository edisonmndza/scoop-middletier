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
    schema: 'scoop',
    tableName: 'positions'
  });
};
