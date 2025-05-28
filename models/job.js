'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Job.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'internship', 'temporary'),
        allowNull: false,
        defaultValue: 'full_time',
      },
      salary: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      remote: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deadline: {
        type: DataTypes.DATE,
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
      modelName: 'Job',
      tableName: 'jobs',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['industry'] },
        { fields: ['location'] },
        { fields: ['type'] },
      ],
    }
  );

  return Job;
};
