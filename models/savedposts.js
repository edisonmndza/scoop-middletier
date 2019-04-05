/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('savedposts', {
    activityid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'postcommentreply',
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
    activestatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    }
  }, {
<<<<<<< HEAD
    schema: 'scoop',
=======
>>>>>>> f1b90cb4b960a3b5ee4bf0ce35eda18c376c080a
    tableName: 'savedposts'
  });
};
