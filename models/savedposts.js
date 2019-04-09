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
    activestatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1',
      field: 'activestatus'
    }
  }, {
    tableName: 'savedposts'
  });
};
