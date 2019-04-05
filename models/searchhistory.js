/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('searchhistory', {
    searchhistoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'users',
        key: 'userid'
      }
    },
    usersearch: {
      type: DataTypes.STRING,
      allowNull: true
    },
    activestatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    }
  }, {
    tableName: 'searchhistory'
  });
};
