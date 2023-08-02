'use strict';
import {Model,UUIDV4} from "sequelize";

type RecipiAttributes = {
recipeId:string,
recipeName:string,
recipeImage:string,
recipePrice:number
}

module.exports = (sequelize:any, DataTypes:any) => {
  class recipe_menu extends Model<RecipiAttributes> 
  implements RecipiAttributes{
    recipeId!:string;
    recipeName!:string;
    recipeImage!:string;
    recipePrice!:number;
    static associate(models:any) {
    recipe_menu.belongsTo(models.User,{
      foreignKey:"createdByUser",
      as:"createdUserInfo"
    })
    }
  }
  recipe_menu.init({
    recipeId:{ 
    type: DataTypes.UUID,
    defaultValue:UUIDV4,
    allowNull:false,
    primaryKey: true
    },
    recipeName:{
      type:DataTypes.STRING,
      allowNull: false
    },
    recipeImage:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    recipePrice:{
      type:DataTypes.INTEGER
    }, 
  }, {
    sequelize,
    modelName: 'recipe_menu',
  });
  return recipe_menu;

};

