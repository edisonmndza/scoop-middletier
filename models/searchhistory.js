/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('searchhistory', {
    searchhistoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'searchhistoryid'
    },
    userid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'users',
        key: 'userid'
      },
      field: 'userid'
    },
    usersearch: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'usersearch'
    },
    activestatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1',
      field: 'activestatus'
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now'),
      field: 'createddate'
    }
  }, {
    tableName: 'searchhistory'
  });
};
