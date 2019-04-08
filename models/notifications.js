/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications', {
    notificationid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
<<<<<<< HEAD
      defaultValue: sequelize.fn('uuid_generate_v4'),
=======
      defaultValue: sequelize.fn('no.uuid_generate_v4'),
>>>>>>> f1b90cb4b960a3b5ee4bf0ce35eda18c376c080a
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
<<<<<<< HEAD
    activityid: {
=======
    activivityid: {
>>>>>>> f1b90cb4b960a3b5ee4bf0ce35eda18c376c080a
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
