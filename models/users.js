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
      references: {
        model: 'genders',
        key: 'genderid'
      }
    },
    divisionid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'divisions',
        key: 'divisionid'
      }
    },
    buildingid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'buildings',
        key: 'buildingid'
      }
    },
    positionid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'positions',
        key: 'positionid'
      }
    },
    profileimage: {
      type: "BYTEA",
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postalcode: {
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
