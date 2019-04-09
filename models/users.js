/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    userid: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
      primaryKey: true,
      field: 'userid'
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'firstname'
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'lastname'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'email'
    },
    passwordhash: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'passwordhash'
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'salt'
    },
    dateofbirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'dateofbirth'
    },
    genderid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'genders',
        key: 'genderid'
      },
      field: 'genderid'
    },
    divisionid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'divisions',
        key: 'divisionid'
      },
      field: 'divisionid'
    },
    buildingid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'buildings',
        key: 'buildingid'
      },
      field: 'buildingid'
    },
    positionid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'positions',
        key: 'positionid'
      },
      field: 'positionid'
    },
    profileimage: {
      type: "BYTEA",
      allowNull: true,
      field: 'profileimage'
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
    },
    modifiedby: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      field: 'modifiedby'
    },
    userstatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'userstatus'
    }
  }, {
    tableName: 'users',
    schema: 'scoop'
  });
};
