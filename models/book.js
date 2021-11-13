'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      book.hasMany(models.bookList, {
        as: "bookList",
        foreignKey: {
          name: "bookId",
        },
      });

    }
  };
  book.init({
    title: DataTypes.STRING,
    publicationDate: DataTypes.STRING,
    pages: DataTypes.STRING,
    author: DataTypes.STRING,
    isbn: DataTypes.STRING,
    about: DataTypes.TEXT,
    bookFile: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};