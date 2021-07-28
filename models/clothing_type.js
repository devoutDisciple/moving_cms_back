const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('clothing_type', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shopid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'clothing_type',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
