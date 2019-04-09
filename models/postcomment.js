/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postcomment', {
    activityid: {
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
    activitytype: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    posttitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    posttext: {
      type: DataTypes.STRING,
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
    },
    otheractivityid: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'postcomment',
        key: 'activityid'
      }
    },
    postimagepath: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'postcomment',
    schema: 'scoop'
  });
};
