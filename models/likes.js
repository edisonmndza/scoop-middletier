/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('likes', {
    likeid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
<<<<<<< HEAD
      defaultValue: sequelize.fn('uuid_generate_v4'),
=======
      defaultValue: sequelize.fn('no.uuid_generate_v4'),
>>>>>>> f1b90cb4b960a3b5ee4bf0ce35eda18c376c080a
      primaryKey: true
    },
    activityid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'postcommentreply',
        key: 'activityid'
      }
    },
    liketype: {
      type: DataTypes.INTEGER,
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
    tableName: 'likes'
  });
};
