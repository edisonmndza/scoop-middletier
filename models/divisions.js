/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('divisions', {
    divisionid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    division_en: {
      type: DataTypes.STRING,
      allowNull: true
    },
    division_fr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    },
    modifieddate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    }
  }, {
    schema: 'scoop',
    tableName: 'divisions'
  });
};
