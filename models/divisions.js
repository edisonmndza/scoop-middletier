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
<<<<<<< HEAD
    schema: 'scoop',
=======
>>>>>>> f1b90cb4b960a3b5ee4bf0ce35eda18c376c080a
    tableName: 'divisions'
  });
};
