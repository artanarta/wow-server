const {book} = require("../../models");

exports.getAllBook = async (req, res) => {
    try {
        let data = await book.findAll({
          attributes: {
            exclude: ['createdAt', 'updatedAt', ],
          },
        });
    
        data = JSON.parse(JSON.stringify(data));
    
        data = data.map((data) => {
          return {
            ...data,
            image: process.env.FILE_PATH + data.image,
            bookFile : process.env.FILE_PATH + data.bookFile,
          };
        });
    
        res.send({
          status: 'success',
          data:{
            books : data
          },
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: 'failed',
          message: 'Server Error',
        });
      }
    };

    exports.getIdBook = async (req, res) => {
        const { id } = req.params;
        try {
           let data = await book.findOne({
              where: {
                id,
              },
              attributes: {
              exclude: [ "createdAt", "updatedAt"],
            },
          });
      
            data = JSON.parse(JSON.stringify(data));
            data = {
            ...data,
            image: process.env.FILE_PATH + data.image,
            bookFile : process.env.FILE_PATH + data.bookFile,
          };

            res.send({
              status: 'success',
              data:{
                book : data
              },
            });
        }   catch (error) {
            console.log(error);
            res.send({
              status: 'failed',
              message: 'Server Error',
            });
        }
     };
  

    exports.addBook = async (req, res) => {
        try {
          const {  ...data } = req.body;
          const books = await book.create({
              ...data,
              image: req.files.image[0].filename,
              bookFile: req.files.bookFile[0].filename,
            });

          let idBook = await book.findOne({
              where: {
                id: books.id,
              },
              attributes: {
                exclude: [ "createdAt", "updatedAt"],
              },
          });

          idBook = JSON.parse(JSON.stringify(idBook));
          idBook = {
          ...idBook,
          image: process.env.FILE_PATH + idBook.image,
          bookFile : process.env.FILE_PATH + idBook.bookFile,
        };

          res.send({
              status: 'success',
              message: 'Add book finished',
              data:{
                book : idBook
              },    
          })
      } catch (error) {
          console.log(error)
          res.send({
              status: 'failed',
              message: 'Server Error'
        })
      }
    }

    exports.updateBook = async (req, res) => {
        try {
            const { id } = req.params
            let data = req.body
        
            
            data = {
              ...data,
              image: req.files.image[0].filename,
              bookFile: req.files.bookFile[0].filename,
          }
    
           await book.update(data,  {
                where: {
                    id
                }
            })

            data = JSON.parse(JSON.stringify(data));
            data = {
            ...data,
            image: process.env.FILE_PATH + data.image,
            bookFile : process.env.FILE_PATH + data.bookFile,
          };
    
            res.send({
                status: 'success',
                message: `Update book id: ${id} finished`,
                data:{
                  book : data
                },
            })
        } catch (error) {
            console.log(error)
            res.send({
                status: 'failed',
                message: 'Server Error'
            })
        }
    }

    exports.deleteBook = async (req, res) => {
      try {
        const { id } = req.params

        await book.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            message: `Delete book id: ${id} finished`
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}