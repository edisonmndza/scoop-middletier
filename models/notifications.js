/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications', {
    notificationid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
      primaryKey: true,
      field: 'notificationid'
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
    activivityid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'postcommentreply',
        key: 'activityid'
      },
      field: 'activivityid'
    },
    likeid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'likes',
        key: 'likeid'
      },
      field: 'likeid'
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
    },
    modifieddate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now'),
      field: 'modifieddate'
    }
  }, {
    tableName: 'notifications'
  });
};
