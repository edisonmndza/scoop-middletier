/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    userid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordhash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateofbirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    genderid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    divisionid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    buildingid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    positionid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    profileimage: {
      type: DataTypes.STRING,
      allowNull: true
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
    modifiedby: {
      type: DataTypes.UUIDV4,
      allowNull: true
    },
    userstatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'scoop',
    tableName: 'users'
  });
};
