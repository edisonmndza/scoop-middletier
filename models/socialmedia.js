/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('socialmedia', {
    socialmediaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'socialmediaid'
    },
    socialmedianame: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'socialmedianame'
    },
    socialmediasymbol: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'socialmediasymbol'
    }
  }, {
    tableName: 'socialmedia'
  });
};
