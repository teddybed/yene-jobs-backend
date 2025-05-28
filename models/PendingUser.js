'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PendingUser extends Model {
    static associate(models) {
      // Define associations here in the future if needed.
    }
  }

  PendingUser.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^\+?[0-9]{7,15}$/, // Allows local or international formats
        },
      },
      role: {
        type: DataTypes.ENUM('admin', 'customer', 'shop', 'sub-admin', 'editor'),
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [6, 6],
        },
      },
      otpExpiry: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'PendingUser',
      tableName: 'pending_users',
      timestamps: true,
      underscored: false,
      indexes: [
        { fields: ['email'] },
        { fields: ['otp'] },
        { fields: ['role'] },
      ],
    }
  );

  return PendingUser;
};
