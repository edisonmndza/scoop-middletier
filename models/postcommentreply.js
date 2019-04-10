/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postcommentreply', {
    activityid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
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
    schema: 'scoop',
    tableName: 'postcommentreply'
  });
};
