import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface)=> {
    // logic for transforming into the new state
    await queryInterface.addColumn(
      'Users', // Make sure the table name is correct (plural form)
      'Password_reset', // Column name
      {
        type: DataTypes.STRING // Column data type
      }
    );
  },

  down: async (queryInterface) => {
    // logic for reverting the changes
    await queryInterface.removeColumn('Users', 'Password_reset');
  }
};
