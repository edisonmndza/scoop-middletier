/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('divisions', {
    divisionid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'divisionid'
    },
    divisionEn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'division_en'
    },
    divisionFr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'division_fr'
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now'),
      field: 'createddate'
    },
    modifieddate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now'),
      field: 'modifieddate'
    }
  }, {
    tableName: 'divisions'
  });
};
