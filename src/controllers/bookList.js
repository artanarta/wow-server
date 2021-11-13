const {bookList , user, book} = require("../../models");

exports.getIdBookList = async (req, res) => {
  const { userId } = req.params
  try {
     let data = await bookList.findAll({
        where: {
         userId
        },
        include: [
          {
            model: user,
            as: "user",
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
          {
            model: book,
            as: "book",
            attributes: { exclude: ["createdAt", "updatedAt", "bookId"] },
          },
        ],
        attributes: {
        exclude: [ "createdAt", "updatedAt", 'userId', 'bookId'],
      },
    });

      res.send({
        status: 'success',
        data: {
          bookList : data,
      }  
      });
  }   catch (error) {
      console.log(error);
      res.send({
        status: 'failed',
        message: 'Server Error',
      });
  }
};


exports.addBookList = async (req, res) => {
  try {
      const {...data } = req.body;
      const booklists = await bookList.create({
          ...data,
          userId : req.user.id
        });

      let idbooklists = await bookList.findOne({
          where: {
            id: booklists.id,
          },
          include: [
            {
              model: user,
              as: "user",
              attributes: { exclude: ["createdAt", "updatedAt", "password"] },
            },
            {
              model: book,
              as: "book",
              attributes: { exclude: ["createdAt", "updatedAt", ] },
            },
          ],
          attributes: {
            exclude: [ "createdAt", "updatedAt", 'userId', 'bookId'],
          },
         
      });

      res.send({
          status: 'success',
          message: 'Add book list finished',
          data:{
            bookList : idbooklists
          }
      })
  } catch (error) {
      console.log(error)
      res.send({
          status: 'failed',
          message: 'Server Error'
      })
  }
}


exports.deleteBookList = async (req, res) => {
  try {
    const { id } = req.params

    await bookList.destroy({
        where: {
            id
        }
    })

    res.send({
        status: 'success',
        message: `Delete bookList id: ${id} finished`
    })
} catch (error) {
    console.log(error)
    res.send({
        status: 'failed',
        message: 'Server Error'
    })
}
}
