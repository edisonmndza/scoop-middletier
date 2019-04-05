/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usersocial', {
    socialmediaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'socialmedia',
        key: 'socialmediaid'
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
    url: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'usersocial'
  });
};
