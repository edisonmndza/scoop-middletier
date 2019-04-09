/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('likes', {
    likeid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
      primaryKey: true,
      field: 'likeid'
    },
    activityid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'postcommentreply',
        key: 'activityid'
      },
      field: 'activityid'
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
    liketype: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'liketype'
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
    tableName: 'likes'
  });
};
