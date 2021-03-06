'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
        // define association here
        bookList.belongsTo(models.user, {
          as: "user",
          foreignKey: "userId",
        });

        bookList.belongsTo(models.book, {
            as: "book",
            foreignKey: "bookId",
          });
      }
    }

    bookList.init({
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'bookList',
  });
  return bookList;
};