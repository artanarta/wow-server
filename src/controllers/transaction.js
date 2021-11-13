const {transaction, user} = require("../../models");

exports.getAllTransaction = async (req, res) => {
    try {
        let data = await transaction.findAll({
          include: [
            {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'gender', 'phone', 'address', 'image', 'role', 'email']
                }
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', "userId" ],
          },
        });
    
        data = JSON.parse(JSON.stringify(data));
    
        data = data.map((data) => {
          return {
            ...data,
            transferProof: process.env.FILE_PATH + data.transferProof,
          };
        });
    
        res.send({
          status: 'success',
          data: {
            transactions : data
        }
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: 'failed',
          message: 'Server Error',
        });
      }
    };

    exports.getIdtransaction = async (req, res) => {
        const { id } = req.params;
        try {
           let idtransaction = await transaction.findOne({
              where: {
                id,
              },
              include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'gender', 'phone', 'address', 'image', 'role', 'email']
                    }
                },
              ],
              attributes: {
              exclude: [ "createdAt", "updatedAt", 'userId'],
            },
          });
      
          idtransaction = JSON.parse(JSON.stringify(idtransaction));
          idtransaction = {
            ...idtransaction,
            transferProof: process.env.FILE_PATH + idtransaction.transferProof,
          };

            res.send({
              status: 'success',
              data: {
                transaction: idtransaction,
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
  

    exports.addTransaction = async (req, res) => {
      try {
        const {...data } = req.body;
        const transactions = await transaction.create({
            ...data,
            transferProof: req.files.transferProof[0].filename,
            userId : req.user.id
          });
        

        let idTransaction = await transaction.findOne({
            where: {
              id: transactions.id,
            },
            include: [
              {
                  model: user,
                  as: 'user',
                  attributes: {
                      exclude: ['createdAt', 'updatedAt', 'password', 'gender', 'phone', 'address', 'image', 'role', 'email']
                  }
              },
            ],
            attributes: {
              exclude: [ "createdAt", "updatedAt"],
            },
        });

        idTransaction = JSON.parse(JSON.stringify(idTransaction));
        idTransaction = {
          ...idTransaction,
          transferProof: process.env.FILE_PATH + idTransaction.transferProof,
        };

        
        res.send({
            status: 'success',
            message: 'Add transaction finished',
            data:{
              transaction : idTransaction
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


    exports.updateTransaction = async (req, res) => {
        try {
          const { id } = req.params

          await transaction.update(req.body, {
              where: {
                  id
              }
          })
  
          res.send({
              status: 'success',
              message: `Update transaction id: ${id} finished`,
              data: {
                transaction : req.body
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

  