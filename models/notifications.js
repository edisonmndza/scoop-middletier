/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications', {
    notificationid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
      primaryKey: true
    },
    userid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'users',
        key: 'userid'
      }
    },
    activityid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'postcommentreply',
        key: 'activityid'
      }
    },
    likeid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'likes',
        key: 'likeid'
      }
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
    },
    modifieddate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    }
  }, {
    schema: 'scoop',
    tableName: 'notifications'
  });
};
