/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postcommentreply', {
    activityid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
<<<<<<< HEAD
      defaultValue: sequelize.fn('uuid_generate_v4'),
=======
      defaultValue: sequelize.fn('no.uuid_generate_v4'),
>>>>>>> f1b90cb4b960a3b5ee4bf0ce35eda18c376c080a
      primaryKey: true
    },
    posttitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    posttext: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postimage: {
      type: "BYTEA",
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
    tableName: 'postcommentreply'
  });
};
