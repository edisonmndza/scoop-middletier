/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reporttable', {
    activityid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'postcomment',
        key: 'activityid'
      }
    },
    userid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userid'
      }
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    activestatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    datecreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    }
  }, {
    schema: 'scoop',
    tableName: 'reporttable'
  });
};
