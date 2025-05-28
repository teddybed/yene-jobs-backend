'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
  static associate(models) {
    this.hasMany(models.Job, {
      foreignKey: 'userId',
      as: 'jobs',
    });
  }
  }

  User.init(
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
        allowNull: false,
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
          is: /^[0-9]+$/,
        },
      },
      role: {
        type: DataTypes.ENUM('job_seeker', 'employer', 'admin'),
        allowNull: false,
        defaultValue: 'job_seeker',
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'default-profile.png',
      },
      coverImage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'default-cover.png',
      },
      bio: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'For employers only',
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      resumeUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Resume link for job seekers',
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pushToken: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: false,
      indexes: [
        { fields: ['email'] },
        { fields: ['role'] },
        { fields: ['industry'] },
      ],
    }
  );

  return User;
};
