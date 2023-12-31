'use strict';
import {Model, UUIDV4} from'sequelize'

type UserAttributes = {
  id: string,
  name: string,
  email: string,
  password: string,
  Password_reset:string
  // other attributes...
};

module.exports = (sequelize:any, DataTypes:any) => {
  class User extends Model<UserAttributes> 
  implements UserAttributes{
    id!: string;
    name!: string;
    email!: string;
    password!: string;
    Password_reset!:string
    // static associate(models: any) {
   
    // }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue:UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false
    },
    Password_reset: {
      type:DataTypes.STRING,
      defaultValue:'',
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

