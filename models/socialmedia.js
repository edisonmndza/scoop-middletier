/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('socialmedia', {
    socialmediaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    socialmedianame: {
      type: DataTypes.STRING,
      allowNull: true
    },
    socialmediasymbol: {
      type: "BYTEA",
      allowNull: true
    }
  }, {
    tableName: 'socialmedia'
  });
};
