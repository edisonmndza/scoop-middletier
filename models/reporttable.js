/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reporttable', {
    activityid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'postcommentreply',
        key: 'activityid'
      },
      field: 'activityid'
    },
    userid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userid'
      },
      field: 'userid'
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'reason'
    },
    activestatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1',
      field: 'activestatus'
    },
    datecreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now'),
      field: 'datecreated'
    }
  }, {
    tableName: 'reporttable'
  });
};
