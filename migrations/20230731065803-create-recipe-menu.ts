'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface:any, Sequelize:any) {
    await queryInterface.createTable('recipe_menus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recipeId: {
        type: Sequelize.STRING
      },
      recipeName: {
        type: Sequelize.STRING
      },
      recipeImage: {
        type: Sequelize.STRING
      },
      recipePrice: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdByUser: {
        type: Sequelize.UUID,
        refrences: {
          model: "User",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface:any, Sequelize:any) {
    await queryInterface.dropTable('recipe_menus');
  }
};