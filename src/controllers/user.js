const { user, transaction } = require('../../models')

exports.getUsers = async (req, res) => {
    try {
        let data = await user.findAll({
            attributes: {
                exclude: ['password','createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data));
    
        data = data.map((data) => {
          return {
            ...data,
            image: process.env.FILE_PATH + data.image,
          };
        });

        res.send({
            status: 'success',
            data: {
                users : data
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

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        let data = req.body

        data = {
          ...data,
          image: req.files.image[0].filename,
      }

        await user.update(data,  {
            where: {
                id
            }
        })

        data = JSON.parse(JSON.stringify(data));
        data = {
        ...data,
        image: process.env.FILE_PATH + data.image,
      };

        res.send({
            status: 'success',
            message: `Update user id: ${id} finished`,
            data: {
                user : data
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


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        await user.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            message: `Delete user id: ${id} finished`
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.getTransactionUser = async (req, res) => {
    try {
        const { id } = req.params;

        let data = await user.findOne({
            where: {
                id
            },

        include: {
             model: transaction,
             as: "trans",
             attributes: {
                exclude: [ "id", "transferProof", "accountNumber", "paymentStatus",  "remainingActive", "createdAt", "updatedAt", ],
             },
        },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });
  
        res.send({
        status: "get id user transaction success",
        data: { data },
      });

    }   catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server error",
        });
    }
  };


